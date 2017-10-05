# ember-cli-fastboot-dotenv

`ember-cli-dotenv`-like addon for Ember.js for FastBoot which allows to use environment variables passed to FastBoot server in runtime.

Use `.env` file for development and production defaults.

```
// .env
COUCH_URL=http://127.0.0.1:5984
DATABASE_NAME=ohne-zeit
CHANGES_FEED=event-source
```

Set allowed keys in `ember-cli-build`:

``` javascript
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'ember-cli-fastboot-dotenv': {
      keys: [ 'COUCH_URL', 'DATABASE_NAME', 'CHANGES_FEED' ]
    }
  });
  return app.toTree();
};
```

Build your app without `.env` or keep it for defaults.

```
$ ember build -prod
$ cd dist
$ npm install
```

Override `.env` defaults with environment variables when running in FastBoot:

``` javascript
// fastboot-server.js
const app = express();
app.get('/*', fastboot('./dist'));
app.listen(3000);
```

```
$ COUCH_URL=http://server:5984 ./fastboot-server.js
```

## Configuration lookup in the app (FastBoot and Browser)

``` javascript
// app/instance-initializers/store.js

export default {
  name: 'app:store',
  after: 'ember-cli-fastboot-dotenv',
  initialize(app) {
    let dotenv = app.lookup('service:dotenv');

    let {
      couchURL,
      databaseName,
      changesFeed
    } = dotenv.getProperties('couchURL', 'databaseName', 'changesFeed');

    // ...
  }
};
```
