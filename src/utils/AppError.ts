export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string = "An unexpected error occurred",
    statusCode = 500,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
