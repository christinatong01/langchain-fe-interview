import { MessageSquare } from "lucide-react";

interface GenerationsRendererProps {
  generations: any[];
}

const GenerationsRenderer = ({ generations }: GenerationsRendererProps) => {
  if (!Array.isArray(generations)) return null;

  return (
    <div className="space-y-3">
      {generations.flat().map((gen: any, index: number) => (
        <div key={index} className="p-3 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Generation {index + 1}</span>
          </div>
          
          {gen.text && (
            <div className="mb-2">
              <span className="text-xs text-green-700">Text:</span>
              <div className="mt-1 p-2 bg-white rounded text-sm">{gen.text}</div>
            </div>
          )}
          
          {gen.message && (
            <div className="mb-2">
              <span className="text-xs text-green-700">Message:</span>
              <div className="mt-1 p-2 bg-white rounded text-sm">
                {gen.message.kwargs?.content || JSON.stringify(gen.message, null, 2)}
              </div>
            </div>
          )}
          
          {gen.generation_info && (
            <div>
              <span className="text-xs text-green-700">Info:</span>
              <div className="mt-1 text-xs text-green-600">
                Model: {gen.generation_info.model_name} | 
                Finish: {gen.generation_info.finish_reason}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GenerationsRenderer; 