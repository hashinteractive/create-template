define([
  'lodash',
  'text!tpl/modal.html',
  'text!tpl/kickout.html',
  'text!tpl/folderSidebarItem.html',
  'text!tpl/pages/home.html',
  'text!tpl/pages/folder.html',
  'text!tpl/images.html',
  'text!tpl/image.html',
  'text!tpl/folderList.html',
  'text!tpl/folderListItem.html',
  'text!tpl/folderImage.html',

], function( _, modal, kickout, folderSidebarItem, home, folder, images, image, folderList, folderListItem, folderImage ){

 return {
    modalTpl: _.template(modal),
    kickoutTpl: _.template(kickout),
    folderSidebarItemTpl: _.template(folderSidebarItem),
    folderTpl: _.template(folder),
    homeTpl: _.template(home),
    imagesTpl: _.template(images),
    imageTpl: _.template(image),
    folderListTpl: _.template(folderList),
    folderListItemTpl: _.template(folderListItem),
    folderImageTpl: _.template(folderImage),
  }
})