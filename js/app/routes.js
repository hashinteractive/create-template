define(['tpl/templates'], function({ homeTpl, folderTpl }){
  
  return [{
    name: 'home',
    path: '#/',
    template: homeTpl,
    callback: function(app){
      app.bindSearch()
      app.renderImages()
    } 
  }, {
    name: 'folder',
    path: '#/folder/:id',
    template: folderTpl,
    callback: function(app){
      app.bindDeleteFromFolderIcon()
      app.bindDeleteFolder()
      app.bindShareIcon()
    }
  }]
})