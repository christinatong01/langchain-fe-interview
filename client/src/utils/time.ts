export const formatDuration = (startTime: string, endTime: string | null): string => {
    if (!endTime) return "Running...";

    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = end.getTime() - start.getTime();

    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
};