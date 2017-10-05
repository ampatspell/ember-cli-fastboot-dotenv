/* eslint-env node */
'use strict';

const merge = (keys, defaults = {}) => {
  let properties = {};
  let env = process.env;
  keys.forEach(key => {
    let value = defaults[key];
    if(value === undefined) {
      value = env[key];
    }
    properties[key] = value;
  });
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
  }
};
