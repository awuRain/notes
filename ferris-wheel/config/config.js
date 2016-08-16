var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'ferris-wheel'
    },
    port: 8000,
    db: 'mongodb://localhost/ferris-wheel'
  },

  test: {
    root: rootPath,
    app: {
      name: 'ferris-wheel'
    },
    port: 8000,
    db: 'mongodb://localhost/ferris-wheel'
  },

  production: {
    root: rootPath,
    app: {
      name: 'ferris-wheel'
    },
    port: 8000,
    db: 'mongodb://localhost/ferris-wheel'
  }
};

module.exports = config[env];
