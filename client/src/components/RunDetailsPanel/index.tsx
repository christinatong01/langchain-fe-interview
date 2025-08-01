import { useEffect, useState } from "react";
import { RunContent, RunNode } from "../../types";
import { ErrorDisplay } from "./ErrorDisplay";
import { RunHeader } from "./RunHeader";
import { InputsSection } from "./InputsSection";
import { OutputsSection } from "./OutputsSection";

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
            setApiError(null); // 404 should not display an error string, just no content
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
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="text-gray-500 text-center">
          Select a node from the trace tree to view details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Run Details</h3>

      <ErrorDisplay
        executionError={selectedNode.error}
        apiError={apiError}
      />

      <RunHeader node={selectedNode} />

      {isLoading ? (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-gray-500">Loading run details...</p>
          </div>
        </div>
      ) : runContent ? (
        <div className="space-y-4">
          <InputsSection inputs={runContent.inputs} />
          <OutputsSection outputs={runContent.outputs} />
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
