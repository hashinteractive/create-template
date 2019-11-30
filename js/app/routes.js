define(['tpl/templates'], function({ homeTpl }){
  
  return [{
    name: 'home',
    path: '#/',
    template: homeTpl,
    callback: function(app){
      app.bindSearch()
      app.renderImages()
    } 
  }]
})