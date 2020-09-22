import { SynthUtils } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { TestStack } from "./TestStack";

test("CloudFormation Test", () => {
  // prepare
  const stack = new TestStack(new App(), "TestStack");
  const resources = SynthUtils.toCloudFormation(stack)["Resources"];
  expect(resources).toMatchSnapshot();
});
