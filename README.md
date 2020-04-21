# aws-cdk-webpack-lambda-function

forked from [@aws-cdk/aws-lambda-nodejs](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-lambda-nodejs)

This library provides constructs for Node.js Lambda function bundled using webpack.

## Quick Start

1. install using yarn:

   ```sh
   $ yarn add -D aws-cdk-webpack-lambda-function @aws-cdk/core @aws-cdk/aws-lambda webpack webpack-cli
   ```

1. add webpack.config.json:

   ```js
   module.exports = {
     mode: 'production', // production or development
     target: 'node',
     externals: ['aws-sdk'], // important!!!
     devtool: 'source-map', // if needed
     optimization: { minimize: false }, // if needed
     // for TypeScript
     module: {
       rules: [
         {
           test: /\.ts$/,
           use: {
             loader: 'ts-loader',
             options,
           },
           exclude: /node_modules/,
         },
        ],
     },
     resolve: {
       extensions: ['.js', '.ts'],
     },
   }
   ```

1. your cdk source code:

   ```typescript
   import { WebpackFunction } from 'aws-cdk-webpack-lambda-function'

   new WebpackFunction(this, 'YourFunction', {
     entry: 'your/path/to/function.ts',
     config: 'your/path/to/webpack.config.js',
   })
   ```

## Options

### entry: string (required)

Path to the entry file (JavaScript or TypeScript).

### config: string (required)

Path to webpack config file.

### handler: string

The name of the exported handler in the entry file.

default: "handler"

### runtime: lambda.Runtime

The runtime environment. Only runtimes of the Node.js family are supported.

default: NODEJS_12

### buildDir: string

The build directory.

default: `.build` in the entry file directory

### ...other options

All other properties of lambda.Function are supported, see also the [AWS Lambda construct library](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-lambda).
