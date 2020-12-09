export class InvalidFileExtensionError extends Error {
  name = "InvalidFileExtensionError";

  constructor(filePath: string) {
    super();
    Object.setPrototypeOf(this, InvalidFileExtensionError.prototype);
    this.message = `Invalid Configuration url: ${filePath}`;
  }
}
