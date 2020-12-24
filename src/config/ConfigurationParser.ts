import { ConfigurationOptions } from "./ConfigurationOptions";
import { InvalidFileExtensionError } from "../error/ConfigurationError/InvalidFileExtensionError";

export class ConfigurationParser {
  static async read(
    filePath: string
  ): Promise<ConfigurationOptions | undefined> {
    let configurationOptions: ConfigurationOptions;
    const allowedFileExtensions = ["json"];
    const fileExtension = filePath.substr(filePath.lastIndexOf("."));
    const foundFileExtension = allowedFileExtensions.find(
      (extension) => `.${extension}` === fileExtension
    );

    switch (foundFileExtension) {
      case "json":
        configurationOptions = await require(filePath);
        break;
    }
    return configurationOptions;
  }
}
