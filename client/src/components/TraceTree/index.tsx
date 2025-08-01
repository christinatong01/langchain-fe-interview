import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { RunNode } from "../../types";
import { buildTraceTree, TreeNode } from "../../utils/treeBuilder";
import { getRunTypeColor, getStatusColor } from '../../utils/colors';
import { useDebouncedCallback } from 'use-debounce';
import { formatDuration } from '../../utils/time';

interface TraceTreeProps {
  nodes: RunNode[];
  onNodeSelect?: (node: RunNode) => void;
  selectedNodeId?: string;
}

/**
 * TraceTree displays a tree of runs with expandable nodes.
 * @param nodes - The list of nodes to build the tree from.
 * @param onNodeSelect - The function to call when a node is selected.
 * @param selectedNodeId - The id of the selected node.
 * @returns TraceTree component
 */
function TraceTree({ nodes, onNodeSelect, selectedNodeId }: TraceTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loadedChildren, setLoadedChildren] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // pre-build search index for fast lookups
  const searchIndex = useMemo(() => {
    return nodes.map(node => ({
      id: node.id,
      name: node.name.toLowerCase(),
      parentId: node.parent_run_id
    }));
  }, [nodes]);

  // fast search function using index
  const getMatchingNodeIds = (searchTerm: string) => {
    const lowerTerm = searchTerm.toLowerCase();
    return searchIndex
      .filter(item => item.name.includes(lowerTerm))
      .map(item => item.id);
  };

  // debounced search
  const debouncedSetSearchTerm = useDebouncedCallback(
    (value: string) => {
      setDebouncedSearchTerm(value);
    },
    300
  );

  // handlers
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSetSearchTerm(value);
  };

  const handleNodeSelect = (node: TreeNode) => {
    onNodeSelect?.(node);
  };

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
        // mark children as loaded when expanding
        setLoadedChildren(prevLoaded => {
          const newLoaded = new Set(prevLoaded);
          newLoaded.add(nodeId);
          return newLoaded;
        });
      }
      return newSet;
    });
  };

  // build expanded tree structure with lazy loading
  const treeNodes = useMemo(() => {
    const applyExpandedState = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => ({
        ...node,
        isExpanded: expandedNodes.has(node.id),
        children: applyExpandedState(node.children)
      }));
    };

    // search logic - process all nodes that match the search term and their ancestors
    if (debouncedSearchTerm.trim()) {
      const matchingIds = getMatchingNodeIds(debouncedSearchTerm);
      const neededIds = new Set(matchingIds);

      matchingIds.forEach(id => {
        let currentNode = nodes.find(n => n.id === id);
        while (currentNode && currentNode.parent_run_id) {
          neededIds.add(currentNode.parent_run_id);
          currentNode = nodes.find(n => n.id === currentNode?.parent_run_id);
        }
      });

      // build tree with only needed nodes
      const nodesToProcess = nodes.filter(n => neededIds.has(n.id));
      const tree = buildTraceTree(nodesToProcess);
      return applyExpandedState(tree);
    }

    // normal lazy loading logic - only process nodes that are root nodes or have loaded children
    const nodesToProcess = nodes.filter(node =>
      !node.parent_run_id || loadedChildren.has(node.parent_run_id)
    );

    const tree = buildTraceTree(nodesToProcess);
    return applyExpandedState(tree);
  }, [expandedNodes, loadedChildren, debouncedSearchTerm, nodes, searchIndex]);

  // render tree node
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isSelected = selectedNodeId === node.id;
    const isExpanded = node.isExpanded;

    const isSearching = debouncedSearchTerm.trim() !== '';
    const hasChildrenInData = nodes.some(n => n.parent_run_id === node.id);
    const hasLoadedChildren = node.children.length > 0;
    const shouldShowChildren = isSearching ? hasLoadedChildren : (hasLoadedChildren && isExpanded);
    const isMatchingSearch = isSearching &&
      searchIndex.find(item => item.id === node.id)?.name.includes(debouncedSearchTerm.toLowerCase());

    return (
      <div key={node.id}>
        <div
          onClick={() => handleNodeSelect(node)}
          className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${isMatchingSearch
            ? "bg-yellow-50 border-yellow-300 shadow-sm" // highlight search matches
            : isSelected
              ? "bg-blue-50 border-blue-300 shadow-sm"
              : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          {/* expand/collapse button */}
          <div className="flex items-center mr-2">
            {hasChildrenInData ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand(node.id);
                }}
                className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            ) : (
              <div className="w-4 h-4" />
            )}
          </div>

          {/* run type chip */}
          <div className={`px-2 py-1 rounded text-xs font-medium border ${getRunTypeColor(node.run_type)} mr-3`}>
            {node.run_type}
          </div>

          {/* node content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{node.name}</div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className={getStatusColor(node.status)}>
                    {node.status}
                  </span>
                  <span>{formatDuration(node.start_time, node.end_time)}</span>
                  {node.total_tokens && (
                    <span>{node.total_tokens} tokens</span>
                  )}
                  {node.total_cost && (
                    <span>${node.total_cost.toFixed(6)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* children */}
        {shouldShowChildren && (
          <div className="mt-1 space-y-1">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Trace Tree</h3>
      </div>

      {/* name filter */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchInput && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* search loader */}
        {searchInput !== debouncedSearchTerm && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* render tree nodes */}
      <div className="space-y-1">
        {treeNodes.map((node) => renderTreeNode(node))}
      </div>

      {/* no nodes found */}
      {treeNodes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {debouncedSearchTerm ? 'No matching traces found' : 'No trace data available'}
        </div>
      )}
    </div>
  );
}

export default TraceTree;
