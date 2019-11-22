define(['lodash', 'text!tpl/example.html'], function( _, example ){
  return {
    exampleTpl: _.template(example)
  }
})