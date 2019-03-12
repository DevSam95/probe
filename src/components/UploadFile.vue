<template>
  <div>
    <div v-if="isLoggedIn" class="upload">
      <v-text-field 
        class="form-text"
        label="Title"
        v-model="model.title"
        required>
      </v-text-field>   
      <v-text-field
        class="form-text"
        label="Author"
        :v-model="model.author">
      </v-text-field>
      <div class="upload-container">
        <div class="image-container">
          <v-icon v-if="file.name">attachment</v-icon><span> {{ file.name }}</span>
        </div>
        <div class="select-container">
          <v-btn
            raised
            class="btn primary"
            @click="onPickFile"
            v-if="!file.name"
          >{{ selectLabel }}</v-btn>
          <v-btn raised class="error" @click="removeFile" v-else>{{ removeLabel }}</v-btn>
          <input type="file" ref="filePicker" :accept="accept" @change="onFilePicked">
          <v-btn raised class="primary" @click="onSubmit" v-show="file.name">Upload</v-btn>
        </div>
      </div>

      <div v-if="percentage > 0" class="progress-container">
        <div> Upload Progress ... {{ percentage }} %</div>
        <v-progress-linear v-model="percentage"></v-progress-linear>
      </div>
    </div>
  </div>
</template>

<script>
// Do something about this. This is not the place for vue resource
import Vue from 'vue';
import VueResource from 'vue-resource';

import mammoth from 'mammoth';
import { mapGetters } from 'vuex';

Vue.use(VueResource);

export default {
  props: {
    value: {
      type: String
    },
    accept: {
      type: [String, Array],
      default: '.docx'
    },
    selectLabel: {
      type: String,
      default: "Select File"
    },
    removeLabel: {
      type: String,
      default: "Remove"
    }
  },

  data() {
    return {
      file: {},
      showProgress: false,
      model: {
        title: '',
        author: ''
      },
      percentage: 0,
      snackMessage: '',
      showSnack: false,
      arrayOfParagraphs: [],
      html: ''
    };
  },

  watch: {
    value(v) {
      this.fileName = v;
    }
  },

  mounted() {
    this.fileUrl = this.value;
  },

  computed: {
    ...mapGetters(['isLoggedIn'])
  },

  methods: {
    onPickFile() {
      this.$refs.filePicker.click();
    },

    onSubmit() {
      this.uploadFile(this.file);
    },

    onFilePicked(event) {
      const files = event.target.files || event.dataTransfer.files;

      if (files && files[0]) {
        let file = files[0];
        this.file = file;
      }
      this.parseDocx();
    },

    parseDocx() {
      let file = this.file;
      let buffer = [];
      var reader = new FileReader();
      reader.onload = (() => {
        return (e) => { 
          buffer = e.target.result;
          mammoth.convertToHtml({arrayBuffer: buffer})
          .then((result) => {
            let html = result.value;
            this.html = html;
            this.arrayOfParagraphs = html.split('<p>');
            this.arrayOfParagraphs = this.arrayOfParagraphs.map((p, i) => {
              p = `<p id="${i}"> ${p}`;
              return p;
            });
          }).done();
        }
      })(file);
      reader.readAsArrayBuffer(file);
    },

    removeFile() {
      this.percentage = 0;
      this.file = {};
    },

    uploadFile(file) {
      this.showSnack = false;
      let formData = new FormData();
      let title = this.model.title ? this.model.title : file.name;
      let author = this.model.author ? this.model.author : 'Sam';

      let payload = {
        document: file,
        fileName: title,
        author: author,
        paragraphs: this.arrayOfParagraphs,
        content: this.html,
        createdBy: 'Sam'
      }

      this.$http.post('http://localhost:1234/docs/uploadDoc', payload, {
        progress: (e) => {
          if (e.lengthComputable) {
            this.percentage = e.loaded / e.total * 100;
          }
        }
      }).then(() => {
        this.snackMessage = 'Upload succesfull';
        this.$bus.emit('snackOn', this.snackMessage);
        this.file = {};
      }, (err) => {
        this.snackMessage = 'Unable to fetch documents: ' + err.message;
        this.showSnack = true;
      })
    }
  }
};
</script>

<style scoped>
input[type="file"] {
  position: absolute;
  left: -99999px;
}

.select-container {
  box-sizing: border-box;
  max-width: 300px;
}

.image-container,
.upload-container {
  max-width: 300px;
}

.upload {
  border: 1px solid #B1B1B1;
  padding: 20px;
}

.form-text {
  width: 400px;
}

.btn {
  color: white;
}
</style>