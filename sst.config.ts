/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "opencomments",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("MyVpc");
    const cluster = new sst.aws.Cluster("MyCluster", { vpc });

    // Create secrets for sensitive environment variables
    const databaseUrl = new sst.Secret("DATABASE_URL");
    const githubClientId = new sst.Secret("GITHUB_CLIENT_ID");
    const githubClientSecret = new sst.Secret("GITHUB_CLIENT_SECRET");
    const betterAuthSecret = new sst.Secret("BETTER_AUTH_SECRET");
    const betterAuthUrl = new sst.Secret("BETTER_AUTH_URL");

    const service = new sst.aws.Service("MyService", {
      cluster,
      image: {
        context: ".",
        dockerfile: "packages/backend/Dockerfile",
      },
      environment: {
        PORT: "8080",
        NODE_ENV: "production",
        DATABASE_URL: databaseUrl.value,
        GITHUB_CLIENT_ID: githubClientId.value,
        GITHUB_CLIENT_SECRET: githubClientSecret.value,
        BETTER_AUTH_SECRET: betterAuthSecret.value,
        BETTER_AUTH_URL: betterAuthUrl.value,
      },
      loadBalancer: {
        domain: "api.asyncreview.com",
        rules: [
          { listen: "80/http", forward: "8080/http" },
          { listen: "443/https", forward: "8080/http" },
        ],
      },
    });

    return {
      api: service.url,
    };
  },
});
