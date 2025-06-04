// Taking advantage of OOP extends to add customize my own class with Error
// This class will help throw errors with specific HTTP status code
class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export default HttpError;
