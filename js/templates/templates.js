define([
  'lodash',
  'text!tpl/page.html',
  'text!tpl/link.html',
  'text!tpl/kickout.html',
  'text!tpl/folderSidebar.html'
], function( _, page, link, kickout, folderSidebar ){

 return {
    pageTpl: _.template(page),
    linkTpl: _.template(link),
    kickoutTpl: _.template(kickout),
    folderSidebarTpl: _.template(folderSidebar)
  }
})