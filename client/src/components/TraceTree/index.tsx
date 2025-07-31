import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { RunNode } from "../../types";
import { buildTraceTree, TreeNode as TreeNodeType } from "../../utils/treeBuilder";
import { getRunTypeColor, getStatusColor } from '../../utils/colors';

interface TraceTreeProps {
  nodes: RunNode[];
  onNodeSelect?: (node: RunNode) => void;
  selectedNodeId?: string;
}

const formatDuration = (startTime: string, endTime: string | null): string => {
  if (!endTime) return "Running...";
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = end.getTime() - start.getTime();
  
  if (duration < 1000) return `${duration}ms`;
  if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
  return `${(duration / 60000).toFixed(1)}m`;
};

/**
 * TraceTree displays a tree of runs with expandable nodes.
 * @param nodes - The list of nodes to build the tree from.
 * @param onNodeSelect - The function to call when a node is selected.
 * @param selectedNodeId - The id of the selected node.
 * @returns TraceTree component
 */
function TraceTree({ nodes, onNodeSelect, selectedNodeId }: TraceTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // build expanded tree structure
  const treeNodes = useMemo(() => {
    const tree = buildTraceTree(nodes);
    
    const applyExpandedState = (nodes: TreeNodeType[]): TreeNodeType[] => {
      return nodes.map(node => ({
        ...node,
        isExpanded: expandedNodes.has(node.id),
        children: applyExpandedState(node.children)
      }));
    };
    
    return applyExpandedState(tree);
  }, [nodes, expandedNodes]);

  const handleNodeSelect = (node: TreeNodeType) => {
    onNodeSelect?.(node);
  };

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderTreeNode = (node: TreeNodeType, depth: number = 0) => {
    const hasChildren = node.children.length > 0;
    const isSelected = selectedNodeId === node.id;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className="w-full">
        {/* node itself */}
        <div
          onClick={() => handleNodeSelect(node)}
          className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
            isSelected
              ? "bg-blue-50 border-blue-300 shadow-sm"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          {/* expand/collapse button */}
          <div className="flex items-center mr-2">
            {hasChildren ? (
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
        {hasChildren && isExpanded && (
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
        <div className="text-sm text-gray-500">
          {nodes.length} total runs
        </div>
      </div>
      
      <div className="space-y-1">
        {treeNodes.map((node) => renderTreeNode(node))}
      </div>
      
      {treeNodes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No trace data available
        </div>
      )}
    </div>
  );
}

export default TraceTree;
