import { Template } from "aws-cdk-lib/assertions";
import { App } from "aws-cdk-lib";
import { TestStack } from "./TestStack";

// CDK generate asset with a generated ID that we want to ignore from the comparison
expect.addSnapshotSerializer({
  test: (val) => typeof val === "string",
  print: (val) => {
    const newVal = (val as string).replace(
      /([A-Fa-f0-9]{64})(\.zip)/,
      "[HASH REMOVED]"
    );
    return `"${newVal}"`;
  },
});

test("CloudFormation Test", () => {
  // prepare
  const stack = new TestStack(new App(), "TestStack");
  const resources = Template.fromStack(stack).toJSON()["Resources"];
  expect(resources).toMatchSnapshot();
});
