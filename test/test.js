const copy = require('../dest/copy')

copy('./**/test.js', './trash/').then(console.log).catch(console.error)
