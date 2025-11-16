/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "opencomments",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      providers: {
        aws: {
          profile: "default",
          region: "us-east-1",
        },
      },
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("MyVpc");
    const cluster = new sst.aws.Cluster("MyCluster", { vpc });

    const service = new sst.aws.Service("MyService", {
      cluster,
      image: {
        context: "./packages/backend",
      },
      loadBalancer: {
        domain: "api.opencomments.com",
        rules: [
          { listen: "80/http" },
          { listen: "443/https", forward: "80/http" },
        ],
      },
    });
  },
});
