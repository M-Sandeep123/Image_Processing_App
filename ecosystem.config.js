module.exports = {
    apps: [
      {
        name: "api-server",
        script: "./server.js",
        watch: false,
        env: {
          NODE_ENV: "production"
        }
      },
      {
        name: "worker",
        script: "./workers/worker.js",
        watch: false,
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  };
  