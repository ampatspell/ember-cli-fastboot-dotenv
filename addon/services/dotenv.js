import Ember from 'ember';

const {
  getOwner,
  get,
  String: { underscore }
} = Ember;

const identifier = 'ember-cli-fastboot-dotenv';

const merge = config => {
  let env = FastBoot.require('process').env;
  let { keys, properties } = config;
  let merged = {};
  keys.forEach(key => {
    let value = env[key];
    if(value === undefined) {
      value = properties[key];
    }
    merged[key] = value;
  });
  return merged;
};

export default Ember.Service.extend({

  properties: null,

  unknownProperty(key) {
    if(typeof key !== 'string') {
      return;
    }
    let properties = this.get('properties');
    let value = get(properties, key);
    if(!value) {
      key = underscore(key).toUpperCase();
      value = get(properties, key);
    }
    return value;
  },

  _load(env) {
    let config = env[identifier];
    let fastboot = getOwner(this).lookup('service:fastboot');
    if(fastboot) {
      let shoebox = fastboot.get('shoebox');
      if(fastboot.get('isFastBoot')) {
        let properties = merge(config);
        shoebox.put(identifier, {
          get properties() {
            return properties;
          }
        });
        this.set('properties', properties);
      } else {
        let properties;
        let object = shoebox.retrieve(identifier);
        if(object) {
          properties = object.properties;
        } else {
          properties = config.properties;
        }
        this.set('properties', properties);
      }
    } else {
      let properties = config.properties;
      this.set('properties', properties);
    }
  }

});
