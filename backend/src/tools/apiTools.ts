export const convertErrorToErrorResponse = (error: Error): { message: string, name: string } => {
    return { message: error.message, name: error.name };
}