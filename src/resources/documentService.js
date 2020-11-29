import VueResource from 'vue-resource';
import Vue from 'vue';

const api = process.env.VUE_APP_API || 'http://localhost:1234';

Vue.use(VueResource);

const customActions = {
  uploadDoc: {
    method: 'POST',
    url: `${api}/docs/uploadDoc`,
    progress: (e) => {
      if (e.lengthComputable) {
        let percentage = e.loaded / e.total * 100;
        return percentage;
      }
    }
  },

  deleteDoc: {
    method: 'PUT',
    url: `${api}/docs/deleteDoc{/id}`
  },

  deleteParas: {
    method: 'PUT',
    url: `${api}/docs/deleteParas`
  },

  getDocuments: {
    method: 'GET',
    url: `${api}/docs/readAll`
  },

  getFile: {
    method: 'GET',
    url: `${api}/docs/readOne{/id}`,
  },

  getCount: {
    method: 'GET',
    url: `${api}/docs/count`
  },

  filterParas: {
    method: 'GET',
    url: `${api}/docs/filterParas`,
  }
}

export default Vue.resource('empty', {}, customActions);

