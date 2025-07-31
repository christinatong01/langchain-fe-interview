import { useEffect, useState } from "react";
import RunDetailsPanel from "./components/RunDetailsPanel";
import TraceTree from "./components/TraceTree";
import { RunNode } from "./types";
import { AlertCircle } from "lucide-react";

function App() {
  const [runNodes, setRunNodes] = useState<RunNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<RunNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRunNodes();
  }, []);

  const fetchRunNodes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/traces`);

      if (!response.ok) {
        setRunNodes([])
        setError(`Failed to fetch traces with ${response.status} ${response.statusText}`)
        return;
      }

      const data = await response.json();
      setRunNodes(data);
    } catch (error) {
      console.error("Failed to fetch traces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeSelect = (node: RunNode) => {
    setSelectedNode(node);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading traces...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          LangSmith Trace Viewer
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Trace Tree */}
          <div className="bg-white rounded-lg border p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading trace nodes...</div>
              </div>
            ) : (
              <TraceTree
                nodes={runNodes}
                selectedNodeId={selectedNode?.id}
                onNodeSelect={handleNodeSelect}
              />
            )}
          </div>

          {/* Right Panel - Run Details */}
          <div className="bg-white rounded-lg border p-6">
            <RunDetailsPanel selectedNode={selectedNode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
