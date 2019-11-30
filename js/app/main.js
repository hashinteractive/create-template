define(function (require) {
  // Load any app-specific modules
  // with a relative require call,
  // like:
  const $ = require('jquery')
  const store = require('app/store')
  const { route, router } = require('silkrouter')
  const templates  = require('tpl/templates')
  const routes = require('app/routes')

  class App{
    constructor($app, store, templates, routes){
      this.$app = $app
      this.store = store
      this.templates = templates
      this.routes = routes
      this._apiKey = 'CkGhT7c5yU8gHcV5QROBGrvA3TFuAXGq'
    }
    bindRoutes(){
      this.routes.forEach(({ name, path, template, callback }) => {
        if(name === 'folder'){
          route(path, async (e) => {
            const { id } = e.params
            let folder = this.store.getters.getFolder(id),
                { images } = folder,
                { folderImageTpl } = this.templates

            //use a promise all to wait for all of the returned image objects
            //from api.giphy.com/v1/gifs/${id}
            let giffys = await Promise.all(images.map(id => {
              return new Promise(async (resolve, reject) => {
                 try{
                   let { data } = await $.get(`http://api.giphy.com/v1/gifs/${id}?api_key=${this._apiKey}`)
                   resolve(data)
                 }catch(e){
                   reject(e)
                 }
              })
            }))
            $('#main', this.$app).html(template({ folder, giffys, folderImageTpl }))
            callback(this)
          })
        }else{
          route(path, (e) => {
            $('#main', this.$app).html(template({ name }))
            callback(this)
          })
        }
      })
    }
    setRoute(route){
      router.set(route)
    }
    bindToggleKickout(){
      //bind the toggle event to the kickout
      $('#kickout', this.$app).on('click', '[data-toggle]', function(e){
        e.delegateTarget.classList.toggle('active')
        $(this)
            .find('[data-fa-i2svg]')
            .toggleClass('fa-caret-left')
            .toggleClass('fa-caret-right');
      })
    }
    bindAddFolder(){
      $('#kickout', this.$app).on('click', '#add', (e) => {
        let $kickout = $(e.delegateTarget)
        let folderName = $('input[name="folder"]', $kickout).val()
        if(!folderName){ alert("Folder name is required"); return; }

        this.store.actions.addFolder(folderName)
        this.renderSidebar()
      })
    }
    bindSearch(){
      $('input[name="search"]', this.$app).on('blur', async (e) => {
        if(!e.target.value) return

        let query = encodeURI(e.target.value)
        try{
          let { data } = await $.get(`http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${this._apiKey}&limit=12`);
          this.renderImages(data)
        }catch(e){
          console.log("Error: ", e)
        }
      })
    }
    bindSaveImageToFolder(){
      $('#folderList .folder', this.$app).on('click', e => {
        let { folder, image } = e.delegateTarget.dataset
        let updated = this.store.actions.saveImageToFolder(folder, image)
        this.renderModal(false)
      })
    }
    bindSaveToFolderIcon(){
      $('.save', this.$app).on('click', e => {
        e.preventDefault()
        let imageId = e.delegateTarget.dataset['id']
        let folders = this.store.getters.getItem('folders') || []
        let { folderListTpl, folderListItemTpl } = this.templates

        let content = folderListTpl({ imageId, folders, folderListItemTpl })
        this.renderModal(true, content)
        this.bindSaveImageToFolder()
      })
    }
    renderModal(active = false, content = ""){
      let { modalTpl } = this.templates
      $('Modal', this.$app).html(modalTpl({ active, content }))
    }
    renderSidebar(){
      //get folders, if not set in localStorage returns null so set to empty array
      let folders = this.store.getters.getItem('folders') || []
      let { kickoutTpl, folderSidebarItemTpl } = this.templates 
      //check if #kickout has class active
      let status = $('#kickout').hasClass('active') ? true : false
      //replace <Kickout></Kickout> with kickoutTpl
      $('Kickout', this.$app).html(kickoutTpl({ status, folderSidebarItemTpl, folders }))
      //bind toggle event to kickout
      this.bindToggleKickout()
      //bind/re-bind addFolder event
      this.bindAddFolder()
    }
    renderImages(images = []){
      let { imagesTpl, imageTpl } = this.templates
      $('Images', this.$app).html(imagesTpl({ images, imageTpl }))
      this.bindSaveToFolderIcon()
    }
    initialize(){
      //render the modal on the page where <Modal></Modal>
      this.renderModal()
      //render the sidebar on the page where <Kickout></Kickout>
      this.renderSidebar()
      //bind the routes. Routes execute callbacks when the router.set(route) event is fired
      this.bindRoutes()
    }
  }

  //create an instance of App and pass in 
  const app = new App($('#app'), store, templates, routes)

  $(document).ready(() => {
    //initialize app
    app.initialize()
    //set the initial route to 'home'
    if(!window.location.hash)
      app.setRoute('#/')

    window.App = app
  })
});