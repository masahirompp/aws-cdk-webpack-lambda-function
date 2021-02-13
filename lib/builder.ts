import * as spawn from "cross-spawn";
import { resolve, basename, dirname } from "path";

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
  private readonly webpackBinPath: string;

  constructor(private readonly options: BuilderOptions) {
    try {
      this.webpackBinPath = resolve(
        require.resolve("webpack-cli"),
        "..",
        "..",
        "..",
        ".bin",
        "webpack-cli"
      );
    } catch (err) {
      throw new Error(
        "It looks like webpack-cli is not installed. Please install webpack and webpack-cli with yarn or npm."
      );
    }
  }

  public build(): void {
    const args = [
      "--config",
      resolve(this.options.config),
      "--output-library-type",
      "commonjs",
      "--entry",
      resolve(this.options.entry),
      "--output-path",
      resolve(dirname(this.options.output)),
      "--output-filename",
      basename(this.options.output),
    ].filter(Boolean) as string[];

    const results = spawn.sync(this.webpackBinPath, args, {
      encoding: "utf-8",
    });

    if (results.error) {
      throw results.error;
    }

    if (results.status !== 0) {
      const { pid, status, stderr, signal, stdout } = results;
      throw new Error(
        JSON.stringify({ pid, signal, status, stdout, stderr }, null, 2)
      );
    }
  }
}
