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

    // Create S3 bucket for CDN assets
    // Note: If bucket name is too long, you may need to create it manually with a shorter name
    const cdnBucket = new sst.aws.Bucket("CdnBucket", {
      public: true,
      cors: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "HEAD"],
        allowHeaders: ["*"],
        maxAge: "3600 seconds",
      },
    });

    // Create CloudFront distribution for CDN
    // Using hardcoded short bucket name to avoid domain name length issues
    // Create bucket manually: aws s3 mb s3://asyncreview-cdn --region us-east-1
    const cdnBucketName = "asyncreview-cdn";
    
    const cdn = new sst.aws.Cdn("Cdn", {
      domain: "cdn.asyncreview.com",
      origins: [
        {
          originId: "S3Origin",
          domainName: `${cdnBucketName}.s3.amazonaws.com`,
          customOriginConfig: {
            httpPort: 80,
            httpsPort: 443,
            originProtocolPolicy: "https-only",
            originSslProtocols: ["TLSv1.2"],
          },
        },
      ],
      defaultCacheBehavior: {
        targetOriginId: "S3Origin",
        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: ["GET", "HEAD", "OPTIONS"],
        cachedMethods: ["GET", "HEAD"],
        compress: true,
        cachePolicyId: "4135ea2d-6df8-44a3-9df3-4b5a84be39ad", // Managed-CachingOptimized
      },
      wait: true,
    });

    return {
      api: service.url,
      cdn: cdn.url,
      cdnBucket: cdnBucketName,
    };
  },
});
