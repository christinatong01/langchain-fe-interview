import { Code } from "lucide-react";

interface ToolCallsRendererProps {
  toolCalls: any[];
}

const ToolCallsRenderer = ({ toolCalls }: ToolCallsRendererProps) => {
  if (!Array.isArray(toolCalls)) return null;

  return (
    <div className="space-y-3">
      {toolCalls.map((toolCall: any, index: number) => (
        <div key={index} className="p-3 border border-purple-200 rounded-lg bg-purple-50">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              {toolCall.name || "Tool Call"}
            </span>
            {toolCall.id && (
              <span className="text-xs text-purple-600 font-mono">{toolCall.id}</span>
            )}
          </div>
          
          {toolCall.args && (
            <div>
              <span className="text-xs text-purple-700">Arguments:</span>
              <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                {JSON.stringify(toolCall.args, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ToolCallsRenderer; 