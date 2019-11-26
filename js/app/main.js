define(function (require) {
  // Load any app-specific modules
  // with a relative require call,
  // like:
  const $ = require('jquery')
  const store = require('app/store')
  //let { route, router } = require('silkrouter')
  const templates  = require('tpl/templates')
  let routes = require('app/routes')

  class App{
    constructor($app, store, templates){
      this.$app = $app
      this.store = store
      this.templates = templates
      this._apiKey = 'CkGhT7c5yU8gHcV5QROBGrvA3TFuAXGq'
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
        this.renderSidebar('active')
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
        console.log(updated)
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
    renderSidebar(status = null){
      //get folders, if not set in localStorage returns null so set to empty array
      let folders = this.store.getters.getItem('folders') || []
      let { kickoutTpl, folderSidebarItemTpl } = this.templates 
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
      this.renderModal()
      this.renderSidebar()
      this.bindSearch()
      this.renderImages()
    }
  }

  //create an instance of App and pass in 
  const app = new App($('#app'), store, templates)

  $(document).ready(() => {
    //initialize app
    app.initialize()
  })
});