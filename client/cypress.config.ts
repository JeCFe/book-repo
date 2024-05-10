import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1600,
  viewportHeight: 900,
  video: false,
  retries: 1,

  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        const mutatedLanuchOptions = launchOptions;
        if (browser.name === "chrome") {
          mutatedLanuchOptions.args.push(
            `--window-size=${config.viewportWidth},${config.viewportHeight}`,
          );
          mutatedLanuchOptions.args.push("--force-device-scale-factor=1");
        }

        if (browser.name === "electron") {
          mutatedLanuchOptions.preferences.width = config.viewportWidth;
          mutatedLanuchOptions.preferences.height = config.viewportHeight;
        }

        if (browser.name === "firefox") {
          mutatedLanuchOptions.args.push(`--width=${config.viewportWidth}`);
          mutatedLanuchOptions.args.push(`--height=${config.viewportHeight}`);
        }
        return mutatedLanuchOptions;
      });
    },
    baseUrl: "http://localhost:3000/",
    experimentalWebKitSupport: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    pageLoadTimeout: 15000,
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
  },
});
