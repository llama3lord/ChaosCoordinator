// Suppress logger stdout output during tests (preserve Jest's own output)
const originalWrite = process.stdout.write.bind(process.stdout);
process.stdout.write = ((chunk: any, ...args: any[]) => {
    if (typeof chunk === 'string' && chunk.includes('[level]=')) {
        return true;
    }
    return (originalWrite as any)(chunk, ...args);
}) as any;
