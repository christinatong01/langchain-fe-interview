import { RunNode } from "../types";

export interface TreeNode extends RunNode {
  children: TreeNode[];
  depth: number;
  isExpanded?: boolean;
}

/**
 * Builds a tree structure from a list of nodes (trace tree)
 * @param nodes - The list of nodes to build the tree from.
 * @returns The root nodes of the tree.
 */
export function buildTraceTree(nodes: RunNode[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  
  // initialize all nodes with empty children arrays
  nodes.forEach(node => {
    nodeMap.set(node.id, {
      ...node,
      children: [],
      depth: 0,
      isExpanded: false
    });
  });
  
  // build tree
  const rootNodes: TreeNode[] = [];
  
  nodes.forEach(node => {
    const treeNode = nodeMap.get(node.id)!;
    
    if (node.parent_run_id === null) {
      // root node
      rootNodes.push(treeNode);
    } else {
      // child node
      const parentNode = nodeMap.get(node.parent_run_id);
      if (parentNode) {
        parentNode.children.push(treeNode);
        treeNode.depth = parentNode.depth + 1;
      } else {
        // if parent not found, treat as root
        rootNodes.push(treeNode);
      }
    }
  });
  
  // Sort children by start time
  function sortChildren(node: TreeNode) {
    node.children.sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
    node.children.forEach(sortChildren);
  }
  
  rootNodes.forEach(sortChildren);
  
  return rootNodes;
} 