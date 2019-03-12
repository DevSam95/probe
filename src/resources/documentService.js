import VueResource from 'vue-resource';
import Vue from 'vue';

Vue.use(VueResource);

const customActions = {
  uploadDoc: {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: 'http://localhost:1234/docs/uploadDoc',
    progress: (e) => {
      if (e.lengthComputable) {
        let percentage = e.loaded / e.total * 100;
        console.log(percentage);
        return percentage;
      }
    }
  },

  getDocuments: {
    method: 'GET',
    url: 'http://localhost:1234/docs/readAll'
  },

  getFile: {
    method: 'GET',
    url: 'http://localhost:1234/docs/readOne{/id}',
  }
}

export default Vue.resource('empty', {}, customActions);

