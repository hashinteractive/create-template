define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var messages = require('./messages');
    var _ = require('lodash')
    var $ = require('jquery')
    var { exampleTpl } = require('tpl/templates')

    $('body').html(exampleTpl())
});
