'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// Esto realiza un merge de la configuracion provista del entorno de produccion.
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  FIREBASE_PROJECT_ID: '"ANOTHER_KEY"'
})
