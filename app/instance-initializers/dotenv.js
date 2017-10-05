import config from '../config/environment';

export default {
  name: 'ember-cli-fastboot-dotenv',
  initialize(app) {
    app.lookup('service:dotenv')._load(config);
  }
};
