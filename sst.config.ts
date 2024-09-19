/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "trivia",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: { random: "4.16.5" },
    };
  },
  async run() {
    const vpc =
      $app.stage === "dev"
        ? new sst.aws.Vpc("Vpc")
        : sst.aws.Vpc.get("Vpc", "lll");
    const cluster = new sst.aws.Cluster("Cluster", {
      vpc,
    });
    cluster.addService("Elixir", {
      scaling: {
        min: 2,
        max: 2,
      },
      environment: {
        SECRET_KEY_BASE: new random.RandomString("SecretKeyBase", {
          length: 64,
        }).result,
        DNS_CLUSTER_QUERY: $interpolate`elixir.${$app.stage}.${$app.name}.sst`,
      },
      public: {
        ports: [
          {
            listen: "80/http",
            forward: "4000/http",
          },
        ],
      },
    });
  },
});