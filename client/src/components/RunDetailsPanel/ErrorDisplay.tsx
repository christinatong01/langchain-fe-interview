import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  executionError?: string | null;
  apiError?: string | null;
}

export const ErrorDisplay = ({ executionError, apiError }: ErrorDisplayProps) => {
  if (!executionError && !apiError) return null;

  return (
    <>
      {/* execution error */}
      {executionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <h4 className="font-medium text-red-800">Run Execution Error</h4>
          </div>
          <p className="text-red-700 text-sm">{executionError}</p>
        </div>
      )}

      {/* API error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <h4 className="font-medium text-red-800">Content Fetching Error</h4>
          </div>
          <p className="text-red-700 text-sm">{apiError}</p>
        </div>
      )}
    </>
  );
}; 