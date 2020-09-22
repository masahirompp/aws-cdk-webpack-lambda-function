import { spawnSync } from "child_process";

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
      this.webpackBinPath = require.resolve("webpack-cli");
    } catch (err) {
      throw new Error(
        "It looks like webpack-cli is not installed. Please install webpack and webpack-cli with yarn or npm."
      );
    }
  }

  public build(): void {
    const args = [
      "--config",
      this.options.config,
      "--output-library-target",
      "commonjs",
      "--entry",
      this.options.entry,
      "--output",
      this.options.output,
    ].filter(Boolean) as string[];

    const results = spawnSync(this.webpackBinPath, args, { encoding: "utf-8" });

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
