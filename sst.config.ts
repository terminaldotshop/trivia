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
    const vpc = sst.aws.Vpc.get("Vpc", "vpc-070a1a7598f4c12d1");
    const cluster = new sst.aws.Cluster("Cluster", {
      vpc,
    });
    cluster.addService("Elixir", {
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
      dev: {
        command: "iex -S mix phx.server",
      },
    });
  },
});
