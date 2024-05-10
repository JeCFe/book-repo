import { defineConfig } from "cypress";

export default defineConfig({
  retries: 1,
  video: false,
  e2e: {
    setupNodeEvents() {},
    baseUrl: "http://localhost:5247",
    experimentalWebKitSupport: true,
  },
});
