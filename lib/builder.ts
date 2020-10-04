import * as webpack from "webpack";
import { Compiler, Configuration } from "webpack";

/**
 * Builder options
 */
export interface BuilderOptions {
  /**
   * entry path
   */
  readonly entry: string;

  /**
   * output path
   */
  readonly output: string;

  /**
   * webpack config file path
   */
  readonly config: string;
}

/**
 * Builder
 */
export class Builder {
  private readonly webpack: Compiler;

  constructor(private readonly options: BuilderOptions) {
    this.webpack = webpack(require(this.options.config) as Configuration);
    this.webpack.options.entry = this.options.entry;
    this.webpack.options.output = {
      libraryTarget: "commonjs",
      path: this.options.output,
      hashFunction: "md4",
    };
  }

  public build(): void {
    this.webpack.run((err: Error) => {
      if (err) {
        throw err;
      }
    });
  }
}
