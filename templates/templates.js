define([
  'lodash',
  'text!tpl/page.html',
  'text!tpl/link.html'
], function( _, page, link ){

 return {
    pageTpl: _.template(page),
    linkTpl: _.template(link)
  }
})