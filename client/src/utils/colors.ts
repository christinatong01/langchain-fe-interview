export const getRunTypeColor = (runType: string, textOnly: boolean = false): string => {
    const colors: Record<string, string> = {
        chain: "bg-blue-100 text-blue-800 border-blue-200",
        llm: "bg-green-100 text-green-800 border-green-200",
        retriever: "bg-purple-100 text-purple-800 border-purple-200",
        parser: "bg-orange-100 text-orange-800 border-orange-200",
        tool: "bg-red-100 text-red-800 border-red-200",
        default: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return textOnly ? colors[runType]?.split(" ")[1] : colors[runType] || colors.default;
};

export const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        success: "text-green-600",
        error: "text-red-600",
        running: "text-yellow-600",
        default: "text-gray-600"
    };
    return colors[status] || colors.default;
};