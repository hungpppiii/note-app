class HttpError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * status: 401
 */
export class UnauthorizedError extends HttpError {}

/**
 * status: 409
 */
export class ConflictError extends HttpError {}
