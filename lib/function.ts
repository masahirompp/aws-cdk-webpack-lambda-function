import {createHash} from "crypto";
import {existsSync} from "fs";
import {basename, dirname, extname, join, resolve} from "path";
import {Construct} from "constructs";
import {
  Function,
  Code,
  FunctionOptions,
  Runtime,
  RuntimeFamily,
  SingletonFunction
} from "aws-cdk-lib/aws-lambda";
import {Builder} from "./builder";


/**
 * Properties for a NodejsFunction
 */
export interface WebpackFunctionProps extends FunctionOptions {
  /**
   * Path to the entry file (JavaScript or TypeScript).
   *
   * @example - aws/lambda/yourFunction.ts
   */
  readonly entry: string;

  /**
   * Path to webpack config file.
   */
  readonly config: string;

  /**
   * The name of the exported handler in the entry file.
   *
   * @default handler
   */
  readonly handler?: string;

  /**
   * The runtime environment. Only runtimes of the Node.js family are
   * supported.
   *
   * @default - NODEJS_14
   */
  readonly runtime?: Runtime;

  /**
   * The build directory
   *
   * @default - `.build` in the entry file directory
   */
  readonly buildDir?: string;

  /**
   * Ensure a unique build path
   *
   * @default - true
   */
  readonly ensureUniqueBuildPath?: boolean;
}

export interface WebpackSingletonFunctionProps extends WebpackFunctionProps {
  readonly uuid: string;
  readonly lambdaPurpose?: string;
}

/**
 * A Node.js Lambda function bundled using Parcel
 */
export class WebpackFunction extends Function {
  constructor(scope: Construct, id: string, props: WebpackFunctionProps) {
    const {runtime, handlerDir, outputBasename, handler} = preProcess(props);

    super(scope, id, {
      ...props,
      runtime,
      code: Code.fromAsset(handlerDir),
      handler: `${outputBasename}.${handler}`,
    });
  }
}

export class WebpackSingletonFunction extends SingletonFunction {
  constructor(
      scope: Construct,
      id: string,
      props: WebpackSingletonFunctionProps
  ) {
    const {runtime, handlerDir, outputBasename, handler} = preProcess(props);

    super(scope, id, {
      ...props,
      runtime,
      code: Code.fromAsset(handlerDir),
      handler: `${outputBasename}.${handler}`,
    });
  }
}

function preProcess(props: WebpackFunctionProps) {
  if (props.runtime && props.runtime.family !== RuntimeFamily.NODEJS) {
    throw new Error("Only `NODEJS` runtimes are supported.");
  }
  if (!/\.(js|ts)$/.test(props.entry)) {
    throw new Error("Only JavaScript or TypeScript entry files are supported.");
  }
  if (!existsSync(props.entry)) {
    throw new Error(`Cannot find entry file at ${props.entry}`);
  }
  if (!existsSync(props.config)) {
    throw new Error(`Cannot find webpack config file at ${props.config}`);
  }
  const handler = props.handler || "handler";
  const runtime = props.runtime || Runtime.NODEJS_14_X;
  const buildDir = props.buildDir || join(dirname(props.entry), ".build");
  const ensureUniqueBuildPath =
      typeof props.ensureUniqueBuildPath === "boolean"
          ? props.ensureUniqueBuildPath
          : true;
  const handlerDir = ensureUniqueBuildPath
      ? createUniquePath(buildDir, props.entry)
      : buildDir;
  const outputBasename = basename(props.entry, extname(props.entry));

  // Build with webpack
  const builder = new Builder({
    entry: resolve(props.entry),
    output: resolve(join(handlerDir, outputBasename + ".js")),
    config: resolve(props.config),
  });
  builder.build();
  return {runtime, handlerDir, outputBasename, handler};
}

function createUniquePath(buildDir: string, currentPath: string) {
  return join(buildDir, createHash("sha256").update(currentPath).digest("hex"));
}
