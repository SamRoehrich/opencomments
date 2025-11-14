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
        }
      },
      home: "aws"
    };
  },
  async run() {
    const router = new sst.aws.Router("My-Router", {
      domain: "asyncreview.com",
    })

    const docs = new sst.aws.TanStackStart("My-Docs", {
      router: {
        instance: router
      },
      path: "packages/frontend",
    })

    const api = new sst.aws.Function("My-Api", {
      handler: "packages/backend/index.handler",
      url: {
        router: {
          instance: router,
          path: "/api",
        }
      },
    })
  },
});
