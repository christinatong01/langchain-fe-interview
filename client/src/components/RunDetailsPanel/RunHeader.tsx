import { RunNode } from "../../types";
import { getRunTypeColor, getStatusColor } from "../../utils/colors";

interface RunHeaderProps {
  node: RunNode;
}

export const RunHeader = ({ node }: RunHeaderProps) => {
  const formatDuration = (startTime: string, endTime: string | null): string => {
    if (!endTime) return "Running...";
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = end.getTime() - start.getTime();
    
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="font-medium text-gray-900 mb-3">Run Information</h4>
      <div className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
        <div>
          <span className="text-gray-500">ID:</span>
          <span className="ml-2 font-mono text-gray-900">{node.id}</span>
        </div>
        <div>
          <span className="text-gray-500">Type:</span>
          <span className={`ml-2 ${getRunTypeColor(node.run_type, true)}`}>
            {node.run_type}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Status:</span>
          <span className={`ml-2 ${getStatusColor(node.status)}`}>
            {node.status}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Duration:</span>
          <span className="ml-2 text-gray-900">
            {formatDuration(node.start_time, node.end_time)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Tokens:</span>
          <span className="ml-2 text-gray-900">{node.total_tokens ?? "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-500">Cost:</span>
          <span className="ml-2 text-gray-900">
            {node.total_cost ? `$${node.total_cost.toFixed(6)}` : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}; 