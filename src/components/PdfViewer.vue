<template>
  <div>
    <div class="tools">
      <div class="book-menu-items">
          <div class="tool-item">
            <tooltip :text="'Search Books'">
              <v-icon slot="content" color="#000000" @click="bookSelected">menu_book</v-icon>
            </tooltip>
          </div>
          <div class="tool-item">
            <tooltip :text="'Full Search'">
              <v-icon slot="content" color="#000000" @click="searchSelected">search</v-icon>
            </tooltip>
          </div>
      </div>
      <div class="book-name">{{ getName(activeDoc.documentName) }}</div>
      <div class="tools-container">
          <div
            v-show="fontSize > 8"       
            @click="fontSize--"
            class="tool-item">
              <tooltip :text="'Zoom Out'">
                <v-icon slot="content" color="#000000">remove</v-icon>
              </tooltip>
          </div>
          <div
            @click="fontSize++"
            v-show="fontSize < 32"
            class="tool-item">
            <tooltip :text="'Zoom In'">
              <v-icon slot="content" color="#000000">add</v-icon>
            </tooltip>
          </div>
          <div
            @click="toggleFullScreen"
            class="tool-item">
              <tooltip :text="'Fullscreen'">
                <v-icon slot="content" color="#000000">fullscreen</v-icon>
              </tooltip>
          </div>
      </div>
    </div>

    <div class="icon-container">
    </div>
    <div class="viewer" :style="{ 'font-size': `${fontSize}px` }" id="viewer">
      <div class="book-content">
        <div id="documentViewer">
          <div v-html="viewableContent"></div>
        </div>
      </div>
      <div class="load-more" v-if="showLoadMoreIcon" @click="loadMoreContent()">
        <v-btn class="load-more-btn" color="#87cefa" flat large>Load More...</v-btn>
      </div>
    </div>
    <div class="loader">  
      <v-dialog max-width="300" v-model="isLoading">
        <v-progress-linear color="#87cefa" active indeterminate></v-progress-linear>
      </v-dialog>
    </div>

    <div v-show="isScrolled" class="scroll-top">
      <v-btn fab dark color="#87cefa" @click="scrollTop">
        <v-icon>arrow_upward</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import Tooltip from './Tooltip';

import DocumentService from '../resources/documentService';
import pdfjs from 'pdfjs-dist';
import Mark from 'mark.js';

  export default {
    components: {Tooltip},
    props: {
      id: {
        type: [Number, String],
        default: 0
      },
      docContent: {
        type: String,
        default: ''
      },
      terms: {
        type: String,
        default: ''
      },
      index: {
        type: [Number, String],
        default: 0
      },
      showBooks: {
        type: Boolean,
        default: true
      },
      showAllResults: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        activePDF: '',
        activePageNumber: 1,
        totalPages: 0,
        content: '',
        isLoading: false,
        viewableContent: '',
        activeCount: 0,
        fontSize: 18,
        isScrolled: false,
        isFullScreen: false,
        lengthToLoad: this.$vuetify.breakpoint.mdAndUp ? 10000 : 2000,
        isMobile: !this.$vuetify.breakpoint.mdAndUp,
        activeDoc: {}
      };
    },
    
    mounted() {
      let $viewer = document.getElementById('documentContainer');
      let observer = new MutationObserver((mutations) => {
        let $p = document.getElementById(this.index);
        if ($p !== null) {
          let $el = $p.querySelector('mark');
          if ($el !== null) {
            $viewer.scrollTop = $el.offsetTop - 60;
          }
        }
      });
      observer.observe($viewer, {childList: true, subtree: true});
      $viewer.addEventListener('scroll', this.handleViewerScroll);
    },

    computed: {
      showLoadMoreIcon() {
        return !this.showAllResults && (this.activeCount <= this.content.length);
      },

      showTools() {
        return this.isMobile ? !this.showBooks : true;
      }
    },
    
    methods: {
      toggleFullScreen() {
        this.isFullScreen = !this.isFullScreen;
        this.$emit('fullScreen', this.isFullScreen);
      },

      getName(name) {
          return name.indexOf('.docx') !== -1 ? name.substr(0, name.length - 5) : name;
      },
            
      bookSelected() {
        this.$emit('showBookList');
      },

      searchSelected() {
        this.$emit('showSearch');
      },

      handleViewerScroll() {
        this.isScrolled = !this.showAllResults && document.getElementById('documentContainer').scrollTop > 200;
      },

      scrollTop() {
        document.getElementById('documentContainer').scrollTop = 0;
      },
      
      toggleBookMenu() {
        this.$emit('booksToggled');
      },

      scrollToPara(paraId) {
        let $p = document.getElementById(paraId);
        let $viewer = document.getElementById('documentContainer');
        if ($p !== null) {
          let $el = $p.querySelector('mark');
          if ($el !== null) {
            $viewer.scrollTop = $el.offsetTop - 60;
          }
        }
      },

      loadMoreContent() {
        const contentToLoad = this.activeCount + this.lengthToLoad;
        this.viewableContent = this.content.substr(0, contentToLoad);
        this.activeCount = contentToLoad;
      },

      goBack() {
        this.$router.push('/books');
      },

      markText(id, text) {
        var context = id ? document.getElementById(id) : document.getElementById('viewer');
        var instance = new Mark(context);
        instance.mark(text || this.terms, { separateWordSearch: false });
      },

      async getFile(id) {
        this.isLoading = true;
        const { ok, data } = await DocumentService.getFile({ id: (id ? id : this.id) });
        if (ok) {
          this.activeDoc = data;
          this.activeCount = 0;
          this.isLoading = false;
          if (!this.showAllResults) {
            document.getElementById('documentContainer').scrollTo(0, 0);
            this.content = data.content;
            this.loadMoreContent();
          } else {
            this.viewableContent = data.content;
            this.$nextTick(() => {
              this.markText(undefined, this.terms);
            })
          }
        }
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
  text-align: justify;
  padding: 20px;
}

.viewer {
  background-color: #FFF;
}

.viewer h1 {
  text-align: center;
}

.viewer h2 {
  text-align: center;
}

.viewer h3 {
  text-align: center;
}

.viewer h4 {
  text-align: center;
}

.viewer p {
  margin-top: 16px;
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
  left: 0;
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

.load-more {
  display: flex;
  position: relative;
}

.load-more-btn {
  flex: 1;
}


.scroll-top {
  position: fixed;
  bottom: 15px;
  right: 15px;
}

.tools {
  display: flex;
  position: sticky;
  top: 0px;
  background-color: #EAEAEA;
  padding: 10px;
}

.tool-item {
  padding-right: 20px;
  cursor: pointer;
}

.tools-container {
  flex: 1;
  display: flex;
  flex-direction: row-reverse;
}

.book-menu-items {
  flex: 1;
  display: flex;
}

.book-name {
  flex: 3;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  display: flex;
}
</style>
