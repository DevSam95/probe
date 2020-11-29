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
        v-model="model.author">
      </v-text-field>
      <v-checkbox v-model="isSong" label="Song"></v-checkbox>
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

const api = process.env.VUE_APP_API || 'http://localhost:1234';

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
      // Not ideal??? idk...
      seasons: [
        {
          period: 'S',
          val: 0.4
        },
        {
          period: 'M',
          val: 0.5
        },
        {
          period: 'A',
          val: 0.6
        },
        {
          period: 'E',
          val: 0.7
        }

      ],
      percentage: 0,
      snackMessage: '',
      showSnack: false,
      arrayOfParagraphs: [],
      html: '',
      isSong: false
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
    isSongFile() {
      console.log(this.isSong);
      return this.isSong;
    },

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

    getDate(file) {

      // Split the filename and look for characters and replace them with numbers. (sorting)
      let date = file.name.split(' ')[0].replace(/-/g, '');
      let dateAsInt;
      this.seasons.forEach((season) => {
        if (date.includes(season.period)) {
          date = date.replace(season.period, '');
          dateAsInt = parseFloat(date) + parseFloat(season.val);
          return dateAsInt;
        }
      });
      return dateAsInt ? dateAsInt : date;
    },
    
    parseDocx() {
      let file = this.file;
      let buffer = [];
      var reader = new FileReader();

      if (this.isSongFile) {
        reader.onload = (() => {
          return (e) => { 
            buffer = e.target.result;
            mammoth.convertToHtml({arrayBuffer: buffer})
                   .then((result) => {
                    let html = result.value;
                    console.log(result);
                   }).done();
          };
        })(file);
        reader.readAsArrayBuffer(file);        
      } else {
        const dateAsString = file.name.split(' ')[0].replace(/-/g, '');
        let date = this.getDate(file);

        reader.onload = (() => {
          return (e) => {
            buffer = e.target.result;
            mammoth.convertToHtml({arrayBuffer: buffer})
            .then((result) => {
              let html = result.value;
              let n = 0;
              this.html = html.replace(/<p>/g, function() {
                return `<p id="${dateAsString + (++n) + ''}">`;
              });
              this.arrayOfParagraphs = html.split('<p>').map((p, i) => {
                return {
                  paragraph: p || ' ',
                  documentName: file.name,
                  pid: dateAsString + (i) + '',
                  year: date,
                  pindex: i
                }
              });
            }).done();
          }
        })(file);
        reader.readAsArrayBuffer(file);
      }
    },

    removeFile() {
      this.percentage = 0;
      this.file = {};
    },

    uploadFile(file) {
      if (this.isSong) {
        
      } else {
        this.showSnack = false;
        const formData = new FormData();
        const title = this.model.title ? this.model.title : file.name;
        const author = this.model.author ? this.model.author : 'Admin';
        let year= this.getDate(file);

        let payload = {
          document: file,
          fileName: title,
          author: author,
          content: this.html,
          createdBy: 'Admin',
          year
        }

        this.$http.post(`${api}/docs/uploadDoc`, payload, {
          progress: (e) => {
            if (e.lengthComputable) {
              this.percentage = e.loaded / e.total * 100;
            }
          }
        }).then((d) => {
          if (d.body.status === 200) {
            this.$http.post(`${api}/docs/uploadParas`, this.arrayOfParagraphs).then((d) => {
              if (d.body.status === 200) {
                this.snackMessage = 'Upload succesfull';
                this.$bus.emit('snackOn', this.snackMessage);
                this.file = {};
              } else {
                this.snackMessage = 'Unable to upload documents';
                this.$bus.emit('snackOn', this.snackMessage);
              }
            }, (e) => {
              this.snackMessage = 'Unable to upload documents';
              this.$bus.emit('snackOn', this.snackMessage);
            })
          } else if (d.body.code === 11000) {
              this.snackMessage = 'Unable to upload documents. Document Already exists';
              this.$bus.emit('snackOn', this.snackMessage);
            } else {
            this.snackMessage = d.body.message;
            this.$bus.emit('snackOn', this.snackMessage);
          }
        }, (err) => {
          this.snackMessage = 'Unable to upload documents: ' + err.message;
          this.$bus.emit('snackOn', this.snackMessage);
        })
        this.file = {};
      }
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