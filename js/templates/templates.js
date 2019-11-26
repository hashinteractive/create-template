define([
  'lodash',
  'text!tpl/modal.html',
  'text!tpl/kickout.html',
  'text!tpl/folderSidebar.html',
  'text!tpl/images.html',
  'text!tpl/image.html'
], function( _, modal, kickout, folderSidebar, images, image ){

 return {
    modalTpl: _.template(modal),
    kickoutTpl: _.template(kickout),
    folderSidebarTpl: _.template(folderSidebar),
    imagesTpl: _.template(images),
    imageTpl: _.template(image)
  }
})