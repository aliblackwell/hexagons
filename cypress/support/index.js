// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import './manage-user-commands';
import './assessment-commands';
import './auth-commands';
import './groups-commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import '@cypress/code-coverage/support';

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  if (
    err.message.includes('Network request failed') ||
    err.message.includes('fetch failed') ||
    (err.cause && err.cause.code === 'ECONNREFUSED')
  ) {
    return false;
  }
  return true;
});
