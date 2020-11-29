<template>
  <div>
    <div class="book-container">
      <div
        class="aside"
        v-show="showBooks">
        <div>
          <div v-show="showBookSearch">
            <book-list :documents="documents"
                       @documentDeleted="deleteDocument"
                       @itemSelected="showContent">
            </book-list>
          </div>

          <div v-show="showParaSearch">
            <para-search @showContent="showContent"
                        @resetSearchTerms="resetSearchTerms"
                        @termsMarked="markTerms"
                        @hideParaSearch="hideParaSearch"
                        @updateTerms="updateSearchTerms">
            </para-search>
          </div>
        </div>
      </div>

      <div :class="['viewer', {'viewer-left': !showBooks}, {'full-screen': viewerFullScreen}]" id="documentContainer">
        <pdf-viewer
          ref="viewer"
          :showBooks="showBooks"
          :terms="searchTerms"
          :id="activeDocumentId"
          :docContent="activeDocContent"
          :index="activeIndex"
          :showAllResults="showParaSearch"
          @booksToggled="showBooks = !showBooks"
          @showBookList="showBookList"
          @fullScreen="toggleFullScreen"
          @showSearch="toggleParaSearch">
        </pdf-viewer>
      </div>
    </div>

    <div class="loader">  
      <v-dialog max-width="300" v-model="isLoading">
        <v-progress-linear color="#87cefa" active indeterminate></v-progress-linear>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import SimpleKeyboard from './SimpleKeybard';
import 'simple-keyboard/build/css/index.css';
import vClickOutside from 'v-click-outside';
import Mark from 'mark.js';

import ItemCard from './ItemCard';
import ItemList from './ItemList';
import PdfViewer from './PdfViewer';
import Tooltip from './Tooltip';

import BookList from './BookList';
import ParaSearch from './ParaSearch';

import _ from 'lodash';

import DocumentService from '../resources/documentService';
import { stat } from 'fs';

export default {
  directives: {
    clickOutside: vClickOutside.directive
  },

  components: {
    ItemCard,
    ItemList,
    PdfViewer,
    Tooltip,
    SimpleKeyboard,
    BookList,
    ParaSearch
  },

  data() {
    return {
      on: true,
      drawer: true,
      documents: [],
      paragraphs: [],
      isLoading: true,
      activeDocumentId: 0,
      searchTerms: '',
      keyboardTerms: '',
      showKeyboard: false,
      keyboard: null,
      activeContent: null,
      searchMode: 'All',
      isMobile: !this.$vuetify.breakpoint.mdAndUp,
      showBooks: this.$vuetify.breakpoint.mdAndUp,
      showAllResults: false,
      showDialog: false,
      showSearchMenu: false,
      activeDocContent: '',
      activeIndex: 0,
      viewerFullScreen: false,
      termCount: 0,
      docsInList: [],
      showBookSearch: true,
      showParaSearch: false
    };
  },

  created() {
    this.getAllDocuments();
  },
  
  computed: {
    getBookCount() {
      let docs = [];
      let doc;
      for (doc of this.documents) {
        const docHasName = doc.documentName.includes(this.searchTerms);
        if (docHasName) {
          docs.push(doc);
        }
      }
      return docs.length;
    }
  },

  methods: {
    hideParaSearch() {
      this.showBooks = false;
    },

    toggleFullScreen(status) {
      this.viewerFullScreen = status;
    },

    updateSearchTerms(terms) {
      this.searchTerms = terms;
    },

    showBookList() {
      if (this.isMobile) {
        this.showBooks = true;
      }
      this.showBookSearch = true;
      this.showParaSearch = false;
    },

    toggleParaSearch() {
      if (this.isMobile) {
        this.showBooks = true;
      }
      this.showParaSearch = true;
      this.showBookSearch = false;
    },

    search() {
      const isBookSearch = this.searchMode !== 'All';
      if (isBookSearch) {
        this.docsInList = [];
        this.showAllResults = false;
        this.unmarkTerms();
        this.searchForBooksUI();
      } else {
        this.searchForParas()
      }
    },

    onKeyboardRender() {
      document.getElementById('simpleKeyboard').value = this.searchTerms;
    },

    onKeyPress(button) {
      if (button === '{cancel}') {
        this.searchTerms = '';
        this.showAllResults = false;
        this.showKeyboard = false;
        this.getAllDocuments();
      } else if (button === '{enter}') {
        this.showKeyboard = false;
      }
    },

    onChange(input) {
      this.searchTerms = this.searchTerms + input.substr(input.length - 1, input.length);
    },

    unMarkViewer() {
      var context = document.querySelector('.viewer');
      var instance = new Mark(context);
      instance.unmark();
    },

    resetResults() {
      this.showAllResults = false;
      this.getAllDocuments();
      this.unMarkViewer();
      this.seenParas = [];
      document.getElementById('documentContainer').scrollTo(0, 0);
    },

    resetSearchTerms() {
      this.searchTerms = '';
      this.resetResults();
    },

    getName(name) {
      return name.indexOf('.docx') !== -1 ? name.substr(0, name.length - 5) : name;
    },

    searchForBooksUI() {
      // ---------------------------------------------------------------------
      // Method named as UI Because there is also server side filtering logic.
      // Please use `searchForBooks()` method for server side filtering if required
      // Filtering Can be done in UI because for a language, books cannot exceed 1000.
      // There should be no performance penalty! Uses native `for loop` for max performance.
      // ------------------------------------------------------------------------
      let docs = [];
      let doc;
      for (doc of this.documents) {
        const docHasName = doc.documentName.includes(this.searchTerms);
        if (docHasName) {
          docs.push(doc);
        }
      }
      this.docsInList = docs;
    },

    getListItems() {
      const isBookSearch = (this.searchTerms && this.searchTerms.length > 0 && this.searchMode !== 'All');
      let docs = isBookSearch ? this.docsInList : this.documents;

      let items = docs.map((doc) => {
        return {
          title: this.getName(doc.documentName),
          icon: 'book',
          id: doc._id,
          content: doc.content ? doc.content : '',
          name: doc.documentName
        }
      });
      return items;
    },

    changeMode(searchMode) {
      this.searchMode = searchMode;
    },

    toggleKeyboard() {
      this.showKeyboard = !this.showKeyboard;
    },

    hideKeyboard() {
      this.showKeyboard = false;
    },
    
    searchForParas() {
      if (this.searchTerms.length > 0) {
        this.isLoading = true;
        let terms = this.wrapWordsWithQuotes(this.searchTerms);
        DocumentService.filterParas({ terms }).then((data) => {
          this.paragraphs = data.body;
          this.isLoading = false;
          this.showAllResults = true;
          this.markTerms();
        }, (err) => {
          this.isLoading = false;
        })
      }
    },

    wrapWordsWithQuotes(input) {
      // Wrap each word from input with quotes
      let output = '';
      output = `\"${input}\"`;
      return output.trim();
    },

    async getParaCount() {
      let terms = this.wrapWordsWithQuotes(this.searchTerms);
      const { body: count } = await DocumentService.getCount({ terms });
      this.termCount = count;        
    },

    searchForBooks() {
      this.isLoading = true;
      this.$nextTick(() => {
        let payload = {
          terms: this.searchTerms.length > 0 ? this.searchTerms : undefined,
          limit: this.limit ? this.limit : undefined
        }
        DocumentService.getDocuments(payload).then((data) => {
          this.documents = data.body;
          this.markTerms();
          this.showAllResults = this.searchMode === 'All' && this.searchTerms.length > 0;
          this.isLoading = false;
        }, (err) => {
          this.errorMessage = 'Unable to fetch documents';
          this.$bus.emit('snackOn', this.errorMessage);
          this.isLoading = false;
        })
      });
    },

    markTerms() {
      this.$nextTick(() => {
        var context = document.querySelectorAll('.card');
        var instance = new Mark(context);
        instance.mark(this.searchTerms, { separateWordSearch: false });
      });
    },

    unmarkTerms() {
      var context = document.querySelectorAll('.card');
      var instance = new Mark(context);
      instance.unmark();
    },

    getAllDocuments() {
      this.isLoading = true;
      DocumentService.getDocuments().then((data) => {
        this.documents = data.body;
        this.$refs.viewer.getFile(data.body[0]._id);
        this.activeDocumentId = data.body[0]._id;
        this.isLoading = false;
      }, (err) => {
        this.errorMessage = 'Unable to fetch documents';
        this.$bus.emit('snackOn', this.errorMessage);
        this.isLoading = false;
      })
    },
    
    showContent(document) {
      if (document.id) {
        this.activeDocumentId = document.id;
        this.$refs.viewer.getFile(document.id);
      } else {
        // Search results hit here.
        let doc = this.documents.filter(d => d.documentName === document.name);

        if (doc) {
          let id = doc ? doc[0]._id : '';
                    
          if (document.index !== this.activeIndex) {
            this.activeIndex = document.index;
          }

          if (id !== this.activeDocumentId) {
            this.activeDocumentId = id;
            this.$refs.viewer.getFile(id);
          } else {
            this.$nextTick(() => {
              this.$refs.viewer.markText(document.index);
              this.$refs.viewer.scrollToPara(document.paraId);
            })
          }
        }
      }
      if (this.isMobile) {
        this.showBooks = false;
      }
    },

    deleteDocument(item) {
      DocumentService.deleteParas({ name: item.name }).then((data) => {
        if (data.body.n > 0) {
          DocumentService.deleteDoc({ id: item.id }).then((data) => {
            this.errorMessage = 'Document Successfully Deleted.';
            this.$bus.emit('snackOn', this.errorMessage);
            this.getAllDocuments();
          }, (err) => {
            this.errorMessage = 'Unable to delete Document. Document Delete failed.';
            this.$bus.emit('snackOn', this.errorMessage);          
          })
        } else {
          this.errorMessage = 'Unable to delete Associated Paras. Document Delete failed.';
          this.$bus.emit('snackOn', this.errorMessage);
        }
      }, (err) => {
        this.errorMessage = 'Unable to delete Associated Paras. Document Delete failed.';
        this.$bus.emit('snackOn', this.errorMessage);
      })
    }
  },

  watch: {
    searchTerms(n) {
      if (n === '') {
        this.searchMode = 'books';
        this.resetResults();
      } else {
        this.getParaCount();
      }
    }
  }
};
</script>

<style>
mark {
  background-color: #87cefa !important;
  color: #000000;
  font-weight: 600;
}
</style>

<style scoped>
.book-container {
  display: flex;
}

.aside {
  min-width: 400px;
  max-width: 400px;
  top: 100px;
  transform: translateX(0, 10);
  background-color: white;
}

.highlight {
  background-color: aqua;
}

.ui-keyboard-case {
  font-size: 16px;
  text-align: center;
  border: 1px solid #ffe3e2;
  padding: 4px;
  margin-right: 5%;
}

.ui-keyboard {
  width: auto;
  right: 0;
  left: auto;
}

.search-field {
  cursor: pointer;
  display: flex;
}

.simple-keyboard {
  width: 530px;
  z-index: 99;
}

.keyboard-container {
  background-color: white;
  position: absolute;
  z-index: 99;
}

.search-filters {
  display: flex;
  font-size: 14px;
  font-weight: bold;
  align-self: center;
}

.books, .all {
  padding: 10px;
  color: white;
}

.text-hightlight {
  color: #87cefa;
  text-decoration: underline;
}

.search-button {
  align-self: center;
}

.viewer {
  position: relative;
  font-size: 18px;
  height: 83vh;
  overflow-y: scroll;
}

.keyboard-icon {
  align-self: center;
} 

.results-container {
  overflow: auto;
  height: 68vh;
}

.viewer-left {
  margin-left: 0px;
}

.search-settings {
  align-self: center;
}

.clear-icon {
  cursor: pointer;
}

.result-count {
  color: black;
  display: flex;
  padding-left: 10px;
}

.hit-counter {
  flex: 1;
}

.options-container {
  padding-left: 10px;
}

.search-mode {
  padding: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.search-mode-highlighted {
  color: #84cefa;
  text-decoration: underline;
}

.full-screen {
  position: absolute;
  width: 100vw;
  height: 100vw;
}

.right-middle {
}
</style>
