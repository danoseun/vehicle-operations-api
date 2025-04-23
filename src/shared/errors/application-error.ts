export class ApplicationError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class NotFoundError extends ApplicationError {
    constructor(resource: string) {
      super(`${resource} not found`, 404);
    }
  }
  
  export class ValidationError extends ApplicationError {
    constructor(message: string) {
      super(message, 400);
    }
  }
  
  export class ConflictError extends ApplicationError {
    constructor(message: string) {
      super(message, 409);
    }
  }