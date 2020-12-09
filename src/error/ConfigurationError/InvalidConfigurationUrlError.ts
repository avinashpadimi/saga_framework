export class InvalidConfigurationUrlError extends Error {
  name = "InvalidConfigurationUrlError";

  constructor(filePath: string) {
    super();
    Object.setPrototypeOf(this, InvalidConfigurationUrlError.prototype);
    this.message = `Invalid Configuration url: ${filePath}`;
  }
}
