// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  auth0Config: {
    app: {
      // needed for auth0
      clientID: 'Az0Vd5YWb1M2mcZ6Nfrj1yvXf7qKdvBt',

      // needed for auth0cordova
      clientId: 'Az0Vd5YWb1M2mcZ6Nfrj1yvXf7qKdvBt',
      domain: 'sbfl-development.auth0.com',
      callbackURL: location.href,
      packageIdentifier: 'com.devconsult.sbfl'
    },
    web: {
      clientID: 'zSOJ8xPzpvQi0RfMuvqu3Q9oRcwEN60K',
      domain: 'sbfl-development.auth0.com',
      responseType: 'token id_token',
      audience: 'https://sbfl-development.auth0.com/userinfo',
      redirectUri: 'http://localhost:4200',
      scope: 'openid profile',
      rememberLastLogin: false
    }
  },
  firebase: {
    apiKey: "AIzaSyBu0h1kEIYs6KSFocW6ca32yuN5F-Cda28",
    authDomain: "sbfl-dev.firebaseapp.com",
    databaseURL: "https://sbfl-dev.firebaseio.com",
    projectId: "sbfl-dev",
    storageBucket: "sbfl-dev.appspot.com",
    messagingSenderId: "147622430845"
  },
  newsapi: {
    apiKey: "d7744aa3fdeb4c7b80e471368aae41df"
  },
  algolia: {
    apiKey: 'cc85e3b6c46c9f11ac6bde73a36c3a33',
    appId: 'PEGDU9D47B',
    indexName: 'idx_groups',
    routing: true,
  },
  firebaseapi: {
    url: "https://us-central1-sbfl-dev.cloudfunctions.net/api"
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
