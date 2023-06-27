module.exports = {
    apps : [{
      name: "cms-service",
      script: "npm run start:ec2",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }
