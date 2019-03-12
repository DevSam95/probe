<template>
  <div>
    <div class="viewer">
      <div class="icon-container">
        <v-icon class="toolbar-icon" color="#49648C" @click="goBack" clickable>arrow_back</v-icon>
      </div>
      <div class="book-content">
        <div id="documentViewer">
          <div v-html="content"></div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import DocumentService from '../resources/documentService';
import pdfjs from 'pdfjs-dist';

import Mark from 'mark.js';

  export default {
    data() {
      return {
        activePDF: '',
        activePageNumber: 1,
        totalPages: 0,
        id: this.$route.params.id,
        terms: this.$route.query.terms,
        index: this.$route.query.index,
        content: ''
      };
    },

    created() {
      this.getFile();
    },

    watch: {
      'activePageNumber': function() {
        this.renderPdf();
      }
    },
    
    methods: {
      goBack() {
        this.$router.push('/books');
      },

      markText() {
        var context = document.querySelector('#documentViewer');
        var instance = new Mark(context);
        instance.mark(this.terms);
        let marks = document.querySelectorAll('mark');
        let currentMark;
        if (marks.length < this.index) {
          // currentMark = marks[this.index - marks.length]; ToDO: Find a way!!!
          currentMark = 0;
        } else {
          currentMark = marks[this.index];
        }
        let position = currentMark.offsetTop - 50;
        window.scrollTo(0, position);
        currentMark.style.backgroundColor = 'orange';
      },

      getFile() {
        DocumentService.getFile({id: this.id}).then((result) => {
          this.content = result.body.content;
          if (this.terms) {
            this.$nextTick(() => {
              this.markText()
            })
          }
        }, (err) => {
          this.errorMessage = 'Unable to fetch document: ' + err.message;
          this.isError = true;
        })
      },

      getPDFData(f) {
        let file = f ? f : {};
        let task = pdfjs.getDocument(file);

        task.promise.then((pdf) => {
          this.totalPages = pdf.numPages;
          this.activePDF = pdf;
          this.renderPdf();
        });
      },

      renderPdf() {
        this.activePDF.getPage(this.activePageNumber).then((page) => {
          var scale = 1.5;
          var viewport = page.getViewport(scale);

          var canvas = document.getElementById('pdfCanvas');
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          var renderContext = {
            canvasContext: context,
            viewport: viewport,
            intent: 'print'
          };
          page.render(renderContext);
        });
      }
    }
  };
</script>

<style>
.book-content {
  text-align: center;
  margin-top: 30px;
}

.viewer {
  background-color: #FFF;
  padding: 10px;
}

.document-toolbar {
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: row-reverse;
  height: 40px;
}

.toolbar-icon {
  cursor: pointer;
  position: absolute;
  right: 0;
}

.icon-container {
  position: relative;
}

.pagination {
  flex: 1;
  margin: 5px;
  width: 100px;
}

#pdfCanvas {
  margin-top: 10px;
}
</style>
