define(function (require) {
  // Load any app-specific modules
  // with a relative require call,
  // like:
  let $ = require('jquery')
  let { route, router } = require('silkrouter')
  let { linkTpl } = require('tpl/templates')
  let routes = require('app/routes')

  routes.forEach(r => {
    /** Functionality for adding route links to main nav **/
    //pass in route object to linkTpl({ name: 'name' })
    let link = linkTpl(r)
    //bind click event to link and call router.set(r.path)
    let $anchor = $(link).on('click', (e) => {
      e.preventDefault();
      router.set(r.path)
    })
    let $li = $('<li></li>').append($anchor)
    $('nav ul').append($li)

    //get localStorage data or set to empty
    let data = window.localStorage.getItem(r.name) || JSON.stringify({ content: '' }),
        parsed = JSON.parse(data)

    route(r.path, (e) => {
      $('#main').html(r.template(parsed))
    })
  })
});
