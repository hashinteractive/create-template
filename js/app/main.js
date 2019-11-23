define(function (require) {
  // Load any app-specific modules
  // with a relative require call,
  // like:
  const $ = require('jquery')
  const store = require('app/store')
  let { route, router } = require('silkrouter')
  let { kickoutTpl } = require('tpl/templates')
  let routes = require('app/routes')

  //replace <Kickout></Kickout> with kickoutTpl
  $('Kickout').replaceWith(kickoutTpl())

  $('#kickout').on('click', '[data-toggle]', function(e){
    e.delegateTarget.classList.toggle('active')
    $(this)
        .find('[data-fa-i2svg]')
        .toggleClass('fa-caret-left')
        .toggleClass('fa-caret-right');
  })

  window.store = store
});