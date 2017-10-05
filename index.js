/* eslint-env node */
'use strict';

const merge = (keys, defaults = {}) => {
  let properties = {};
  keys.forEach(key => properties[key] = defaults[key] || process.env[key]);
  return properties;
}

module.exports = {
  name: 'ember-cli-fastboot-dotenv',
  isDevelopingAddon() {
    return true;
  },
  config(environment) {
    if(!this.app) {
      return;
    }

    const path = require('path');
    const readFileSync = require('fs').readFileSync;
    const dotenv = require('dotenv');
    const existsSync = require('exists-sync');

    let dotenvPath = path.join(this.project.root, '.env');
    let defaults = {};

    if(existsSync(dotenvPath)) {
      dotenv.config({ path: dotenvPath });
      defaults = dotenv.parse(readFileSync(dotenvPath));
    }

    let name = this.name;
    let keys = (this.app.options && this.app.options[name] && this.app.options[name].keys) || [];

    let properties = merge(keys, defaults);

    return {
      [name]: {
        keys,
        properties
      }
    };
  },
  _fastbootProperties(config) {
    return merge(config.keys, config.properties);
  }
};
