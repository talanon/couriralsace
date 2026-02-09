const nextEnv = require('@next/env');
if (!nextEnv.default) {
  nextEnv.default = {
    loadEnvConfig: nextEnv.loadEnvConfig,
  };
}
