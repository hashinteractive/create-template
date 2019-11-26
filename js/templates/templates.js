define([
  'lodash',
  'text!tpl/modal.html',
  'text!tpl/kickout.html',
  'text!tpl/folderSidebarItem.html',
  'text!tpl/images.html',
  'text!tpl/image.html',
  'text!tpl/folderList.html',
  'text!tpl/folderListItem.html',

], function( _, modal, kickout, folderSidebarItem, images, image, folderList, folderListItem ){

 return {
    modalTpl: _.template(modal),
    kickoutTpl: _.template(kickout),
    folderSidebarItemTpl: _.template(folderSidebarItem),
    imagesTpl: _.template(images),
    imageTpl: _.template(image),
    folderListTpl: _.template(folderList),
    folderListItemTpl: _.template(folderListItem),
  }
})