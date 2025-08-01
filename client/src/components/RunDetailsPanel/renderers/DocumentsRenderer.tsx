import { Database, ExternalLink } from "lucide-react";
import { RunContent } from "../../../types";

interface DocumentsRendererProps {
  documents: RunContent['outputs']['documents'];
}

const DocumentsRenderer = ({ documents }: DocumentsRendererProps) => {
  if (!Array.isArray(documents)) return null;

  return (
    <div className="space-y-3">
      {documents.map((doc: RunContent['outputs']['documents'][number], index: number) => (
        <div key={index} className="p-3 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                Document {index + 1}
              </span>
            </div>
            {doc.metadata?.source && (
              <a
                href={doc.metadata.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Source
              </a>
            )}
          </div>
          
          {doc.metadata?.title && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">Title:</span>
              <span className="ml-2 text-sm font-medium">{doc.metadata.title}</span>
            </div>
          )}
          
          {doc.metadata?.source && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">Source:</span>
              <span className="ml-2 text-sm text-blue-600 break-all">{doc.metadata.source}</span>
            </div>
          )}

          {doc.metadata?.uuid && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">UUID:</span>
              <span className="ml-2 text-sm text-blue-600 break-all">{doc.metadata.uuid}</span>
            </div>
          )}
          
          <div className="mb-2">
            <span className="text-xs text-gray-500">Content:</span>
            <div className="mt-1 p-2 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto">
              {doc.page_content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentsRenderer; 