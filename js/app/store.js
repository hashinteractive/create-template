define(['lodash'], function(_){
  class Store {
    constructor() {
      this.mutations = {
        setItem: (key, value) => {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      };
      this.getters = {
        getItem: (key) => {
          return JSON.parse(window.localStorage.getItem(key))
        }
      }
    }
  }

  return new Store()
})