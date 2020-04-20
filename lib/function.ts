import { existsSync } from 'fs'
import { basename, dirname, extname, join, resolve } from 'path'
import { Code, Function, FunctionOptions, Runtime, RuntimeFamily } from '@aws-cdk/aws-lambda'
import { Construct } from '@aws-cdk/core'
import { Builder } from './builder'

/**
 * Properties for a NodejsFunction
 */
export interface WebpackFunctionProps extends FunctionOptions {
  /**
   * Path to the entry file (JavaScript or TypeScript).
   *
   * @example - aws/lambda/yourFunction.ts
   */
  readonly entry: string

  /**
   * Path to webpack config file.
   */
  readonly config: string

  /**
   * The name of the exported handler in the entry file.
   *
   * @default handler
   */
  readonly handler?: string

  /**
   * The runtime environment. Only runtimes of the Node.js family are
   * supported.
   *
   * @default - NODEJS_12
   */
  readonly runtime?: Runtime

  /**
   * The output root directory.
   *
   * @default - Output to the same directory as entry
   */
  readonly outputBaseDir?: string
}

/**
 * A Node.js Lambda function bundled using Parcel
 */
export class WebpackFunction extends Function {
  constructor(scope: Construct, id: string, props: WebpackFunctionProps) {
    if (props.runtime && props.runtime.family !== RuntimeFamily.NODEJS) {
      throw new Error('Only `NODEJS` runtimes are supported.')
    }
    if (!/\.(js|ts)$/.test(props.entry)) {
      throw new Error('Only JavaScript or TypeScript entry files are supported.')
    }
    if (!existsSync(props.entry)) {
      throw new Error(`Cannot find entry file at ${props.entry}`)
    }
    if (!existsSync(props.config)) {
      throw new Error(`Cannot find webpack config file at ${props.config}`)
    }

    const handler = props.handler || 'handler'
    const runtime = props.runtime || Runtime.NODEJS_12_X
    const outputPath = join(props.outputBaseDir || '', dirname(props.entry))
    const outputBasename = basename(props.entry, extname(props.entry))

    // Build with Parcel
    const builder = new Builder({
      entry: resolve(props.entry),
      output: resolve(join(outputPath, outputBasename + '.js')),
      config: resolve(props.config),
    })
    builder.build()

    super(scope, id, {
      ...props,
      runtime,
      code: Code.fromAsset(outputPath),
      handler: `${outputBasename}.${handler}`,
    })
  }
}
