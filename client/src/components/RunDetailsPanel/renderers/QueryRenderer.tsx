import { MessageSquare } from "lucide-react";

interface QueryRendererProps {
  query: string;
}

const QueryRenderer = ({ query }: QueryRendererProps) => {
  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">Query</span>
      </div>
      <div className="text-sm">{query}</div>
    </div>
  );
};

export default QueryRenderer; 