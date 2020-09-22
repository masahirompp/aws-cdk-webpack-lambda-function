import { App, Construct, Stack, StackProps } from "@aws-cdk/core";
import { WebpackFunction, WebpackSingletonFunction } from "../lib/index";

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // test1
    new WebpackFunction(this, "WebpackFunction", {
      entry: "test/lambda/testFunction.ts",
      config: "test/lambda/webpack.config.js",
    });

    // test2
    new WebpackSingletonFunction(this, "WebpackSingletonFunction", {
      uuid: "be82c13f-a959-4837-91d7-1a3aabb2626a",
      entry: "test/lambda/testFunction.ts",
      config: "test/lambda/webpack.config.js",
    });
  }
}

const app = new App();
new TestStack(app, "TestStack");
app.synth();
