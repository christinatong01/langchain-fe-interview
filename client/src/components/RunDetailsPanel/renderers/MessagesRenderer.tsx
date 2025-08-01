import { Code, MessageSquare } from "lucide-react";
import { RunContent } from "../../../types";

interface MessagesRendererProps {
  messages: RunContent['outputs']['messages'];
}

const MessagesRenderer = ({ messages }: MessagesRendererProps) => {
  if (!Array.isArray(messages)) return null;

  return (
    <div className="space-y-3">
      {messages.flat().map((message: RunContent['outputs']['messages'][number], index: number) => {
        // handle both lc format (with kwargs) and simplified format
        let messageData = message;
        
        if (message?.kwargs) {
          messageData = message.kwargs;
        } else if (message?.role || message?.type) {
          messageData = message;
        } else {
          return null;
        }
        
        const { content, type, role, id } = messageData;
        const messageType = type || role;
        
        const isSystem = messageType === "system";
        const isHuman = messageType === "human" || messageType === "user";
        const isAI = messageType === "ai" || messageType === "assistant";
        
        return (
          <div key={index} className={`p-3 rounded-lg border ${
            isSystem ? "bg-blue-50 border-blue-200" :
            isHuman ? "bg-gray-50 border-gray-200" :
            isAI ? "bg-green-50 border-green-200" :
            "bg-white border-gray-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isSystem && <Code className="w-4 h-4 text-blue-600" />}
              {isHuman && <MessageSquare className="w-4 h-4 text-gray-600" />}
              {isAI && <MessageSquare className="w-4 h-4 text-green-600" />}
              <span className={`text-xs font-medium ${
                isSystem ? "text-blue-700" :
                isHuman ? "text-gray-700" :
                isAI ? "text-green-700" :
                "text-gray-700"
              }`}>
                {messageType?.toUpperCase() || "UNKNOWN"}
              </span>
              {id && (
                <span className="text-xs text-gray-500 font-mono">{id}</span>
              )}
            </div>
            <div className="text-sm whitespace-pre-wrap">{content}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesRenderer;
