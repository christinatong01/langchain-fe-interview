import { useEffect, useState } from "react";
import { AlertCircle, FileText, MessageSquare } from "lucide-react";
import { RunContent, RunNode } from "../../types";
import { getRunTypeColor, getStatusColor } from "../../utils/colors";
import { DocumentsRenderer, GenerationsRenderer, MessagesRenderer, QueryRenderer, ToolCallsRenderer } from "./renderers";

interface RunDetailsPanelProps {
  selectedNode: RunNode | null;
}

function RunDetailsPanel({ selectedNode }: RunDetailsPanelProps) {
  const [runContent, setRunContent] = useState<RunContent | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchRunContent() {
      if (!selectedNode) {
        setRunContent(null);
        setApiError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch(`/api/traces/${selectedNode.id}`);

        if (!response.ok) {
          setRunContent(null);
          if (response.status === 404) {
            setApiError(null); // 404 is not an error, just no content
          } else {
            setApiError(`Failed to fetch run content with HTTP status ${response.status} ${response.statusText}`);
          }
          return;
        }

        const data = await response.json();
        setRunContent(data);
        setApiError(null);
      } catch (error) {
        console.error("Failed to fetch run content:", error);
        setRunContent(null);
        setApiError(`Failed to fetch run content: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRunContent();
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border">
        <p className="text-gray-500 text-center">
          Select a node from the trace tree to view details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Run Details</h3>

      {/* error display for trace tree errors */}
      {selectedNode.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <h4 className="font-medium text-red-800">Run Execution Error</h4>
          </div>
          <p className="text-red-700 text-sm">{selectedNode.error}</p>
        </div>
      )}

      {/* error display for fetching node content */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <h4 className="font-medium text-red-800">Content Fetching Error</h4>
          </div>
          <p className="text-red-700 text-sm">{apiError}</p>
        </div>
      )}

      {/* run information */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-3">Run Information</h4>
        <div className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">ID:</span>
            <span className="ml-2 font-mono text-gray-900">{selectedNode.id}</span>
          </div>
          <div>
            <span className="text-gray-500">Type:</span>
            <span className={`ml-2 ${getRunTypeColor(selectedNode.run_type, true)}`}>{selectedNode.run_type}</span>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <span className={`ml-2 ${getStatusColor(selectedNode.status)
              }`}>
              {selectedNode.status}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Duration:</span>
            <span className="ml-2 text-gray-900">
              {selectedNode.end_time
                ? `${new Date(selectedNode.end_time).getTime() - new Date(selectedNode.start_time).getTime()}ms`
                : 'Running...'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-500">Tokens:</span>
            <span className="ml-2 text-gray-900">{selectedNode.total_tokens ?? "N/A"}</span>
          </div>
          <div>
            <span className="text-gray-500">Cost:</span>
            <span className="ml-2 text-gray-900">{selectedNode.total_cost ? `$${selectedNode.total_cost.toFixed(6)}` : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* inputs and outputs */}
      {isLoading ? (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-gray-500">Loading run details...</p>
          </div>
        </div>
      ) : runContent ? (
        <div className="space-y-4">
          {/* inputs */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Inputs
            </h4>

            {/* handle different input types */}
            {runContent.inputs.messages ? (
              <MessagesRenderer messages={runContent.inputs.messages} />
            ) : runContent.inputs.query ? (
              <QueryRenderer query={runContent.inputs.query} />
            ) : (
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(runContent.inputs, null, 2)}
              </pre>
            )}
          </div>

          {/* outputs */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Outputs
            </h4>

            <div className="space-y-4">
              {/* messages */}
              {runContent.outputs.messages && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Messages</h5>
                  <MessagesRenderer messages={runContent.outputs.messages} />
                </div>
              )}

              {/* documents */}
              {runContent.outputs.documents && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
                  <DocumentsRenderer documents={runContent.outputs.documents} />
                </div>
              )}

              {/* generations */}
              {runContent.outputs.generations && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Generations</h5>
                  <GenerationsRenderer generations={runContent.outputs.generations} />
                </div>
              )}

              {/* tool calls */}
              {runContent.outputs.tool_calls && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Tool Calls</h5>
                  <ToolCallsRenderer toolCalls={runContent.outputs.tool_calls} />
                </div>
              )}

              {/* other outputs */}
              {!runContent.outputs.messages && 
               !runContent.outputs.documents && 
               !runContent.outputs.generations && 
               !runContent.outputs.tool_calls && (
                <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
                  {JSON.stringify(runContent.outputs, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-gray-500 text-center">
            No detailed content available for this node
          </p>
        </div>
      )}
    </div>
  );
}

export default RunDetailsPanel;
