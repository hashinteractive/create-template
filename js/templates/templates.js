define([
  'lodash',
  'text!tpl/page.html',
  'text!tpl/link.html',
  'text!tpl/kickout.html'
], function( _, page, link, kickout ){

 return {
    pageTpl: _.template(page),
    linkTpl: _.template(link),
    kickoutTpl: _.template(kickout)
  }
})