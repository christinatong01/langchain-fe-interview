import { MessageSquare } from "lucide-react";
import { RunContent } from "../../types";
import { DocumentsRenderer, GenerationsRenderer, MessagesRenderer } from "./dataRenderers";

interface OutputsSectionProps {
  outputs: RunContent['outputs'];
}

export const OutputsSection = ({ outputs }: OutputsSectionProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Outputs
      </h4>

      <div className="space-y-4">
        {/* messages */}
        {outputs.messages && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Messages</h5>
            <MessagesRenderer messages={outputs.messages} />
          </div>
        )}

        {/* documents */}
        {outputs.documents && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
            <DocumentsRenderer documents={outputs.documents} />
          </div>
        )}

        {/* generations */}
        {outputs.generations && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Generations</h5>
            <GenerationsRenderer generations={outputs.generations} />
          </div>
        )}

        {/* other outputs */}
        {!outputs.messages &&
          !outputs.documents &&
          !outputs.generations && (
            <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(outputs, null, 2)}
            </pre>
          )}
      </div>
    </div>
  );
}; 