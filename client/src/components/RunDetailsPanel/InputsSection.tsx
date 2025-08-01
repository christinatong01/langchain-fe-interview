import { FileText } from "lucide-react";
import { RunContent } from "../../types";
import { MessagesRenderer, QueryRenderer } from "./dataRenderers";

interface InputsSectionProps {
  inputs: RunContent['inputs'];
}

export const InputsSection = ({ inputs }: InputsSectionProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Inputs
      </h4>

      {/* handle different input types */}
      {inputs.messages ? (
        <MessagesRenderer messages={inputs.messages} />
      ) : inputs.query ? (
        <QueryRenderer query={inputs.query} />
      ) : (
        <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
          {JSON.stringify(inputs, null, 2)}
        </pre>
      )}
    </div>
  );
}; 