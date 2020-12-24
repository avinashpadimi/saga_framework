export class MissingLoadConfiguration extends Error {
  name = "MissingLoadConfiguration";

  constructor() {
    super();
    Object.setPrototypeOf(this, MissingLoadConfiguration.prototype);
    this.message = `Initial Configuration setup was missing, please run loadConfiguration`;
  }
}
