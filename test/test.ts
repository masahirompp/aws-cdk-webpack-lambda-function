import { SynthUtils } from "@aws-cdk/assert";
import { App } from "aws-cdk-lib";
import { TestStack } from "./TestStack";

// CDK generate asset with a generated ID that we want to ignore from the comparison
expect.addSnapshotSerializer({
  test: val => typeof val === 'string',
  print: val => {
    const newVal = (val as string).replace(/AssetParameters([A-Fa-f0-9]{64})(\w+)/, '[HASH REMOVED]');
    const newVal2 = newVal.replace(/(\w+) (\w+) for asset\s?(version)?\s?"([A-Fa-f0-9]{64})"/, '[HASH REMOVED]');
    return `"${newVal2}"`;
  },
});

test("CloudFormation Test", () => {
  // prepare
  const stack = new TestStack(new App(), "TestStack");
  const resources = SynthUtils.toCloudFormation(stack)["Resources"];
  expect(resources).toMatchSnapshot();
});
