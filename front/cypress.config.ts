import { defineConfig } from 'cypress'

export default defineConfig({
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  video: false,
  pageLoadTimeout: 5000,
  defaultCommandTimeout : 5100,
  e2e: {
    baseUrl: 'http://localhost:4200',
  },
  env: {
    backendUrl: 'http://localhost:3001',
  }
})
