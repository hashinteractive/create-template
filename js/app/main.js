define(function (require) {
  // Load any app-specific modules
  // with a relative require call,
  // like:
  const $ = require('jquery')
  const store = require('app/store')
  let { route, router } = require('silkrouter')
  let { kickoutTpl, folderSidebarTpl } = require('tpl/templates')
  let routes = require('app/routes')

  // class App{
  //   constructor(store){
  //     this.store = store
  //   },
  //   initialize: function(){

  //   }
  // }
  //get folders, if not set in localStorage returns null so set to empty array
  let folders = store.getters.getItem('folders') || []
  //replace <Kickout></Kickout> with kickoutTpl
  $('Kickout').html(kickoutTpl({ folderSidebarTpl, folders }))

  $('#kickout').on('click', '[data-toggle]', function(e){
    e.delegateTarget.classList.toggle('active')
    $(this)
        .find('[data-fa-i2svg]')
        .toggleClass('fa-caret-left')
        .toggleClass('fa-caret-right');
  })

  window.store = store
});