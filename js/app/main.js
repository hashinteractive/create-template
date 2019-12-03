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
      this._apiKey = 'CkGhT7c5yU8gHcV5QROBGrvA3TFuAXGq',
      this._query = ''
      this._offset = 0
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
                   let { data } = await $.get(`//api.giphy.com/v1/gifs/${id}?api_key=${this._apiKey}`)
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
    async getImagesApi(){
       try{
          let { data } = await $.get(`//api.giphy.com/v1/gifs/search?q=${this._query}&offset=${this._offset}&api_key=${this._apiKey}&limit=12`);
          this.renderImages(data)
        }catch(e){
          console.log("Error: ", e)
        }
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
        let folderName = $('input[name="folder"]', $kickout).val().toLowerCase()
        if(!folderName){ alert("Folder name is required"); return; }

        this.store.actions.addFolder(folderName)
        this.renderSidebar()
      })
    }
    bindPaginate(){
      $('.paginate', this.$app).on('click', 'a', e => {
        e.preventDefault()
        let offset = e.target.dataset['offset']
        this._offset = offset
        this.getImagesApi()
      })
    }
    bindSearch(){
      $('input[name="search"]', this.$app).on('blur', (e) => {
        if(!e.target.value) return

        this._query = encodeURI(e.target.value)
        this.getImagesApi()
      })
    }
    bindSaveImageToFolder(){
      $('#folderList .folder', this.$app).on('click', e => {
        let { folder, image } = e.delegateTarget.dataset
        let updated = this.store.actions.saveImageToFolder(folder, image)
        this.renderSidebar()
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
    bindDeleteFromFolderIcon(){
      $('.image', this.$app).on('click', '.delete', e => {
        e.preventDefault()
        let image = e.delegateTarget,
            imageId = image.dataset['id'],
            folderId = image.dataset['folder']
        //delete the image from the folder
        this.store.actions.deleteImageFromFolder(folderId, imageId)
        //delete the .image div from the folderTpl 
        $(image).remove()
        this.renderSidebar()
      })
    }
    bindShareIcon(){
      $('.image', this.$app).on('click', '.share', e => {
        e.preventDefault()
        let image = e.delegateTarget,
            bitly = image.dataset['bitly'],
            content = `<div class="p-2 bg-gray-200 rounded">${bitly}</div>`
        this.renderModal(true, content)
      })
    }
    bindDeleteFolder(){
      $('.folder', this.$app).on('click', '.remove', e => {
        let id = e.delegateTarget.dataset['id'],
            name = e.delegateTarget.dataset['name'] 

        if(!confirm(`Are you sure you want to delete folder: ${name}? This will delete the folder and all saved images in this folder.`)) return

        let deleted = this.store.actions.deleteFolder(id)
        this.renderSidebar()
        this.setRoute('#/')
      })
    }
    renderModal(active = false, content = ""){
      let { modalTpl } = this.templates
      $('Modal', this.$app).html(modalTpl({ active, content }))
      $('#modal', this.$app).on('click', '.close', e => { this.renderModal(false) })
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
      $('Images', this.$app).html(imagesTpl({ offset: this._offset, images, imageTpl }))
      this.bindSaveToFolderIcon()
      this.bindPaginate()
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