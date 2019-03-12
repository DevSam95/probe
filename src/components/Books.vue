<template>
  <div>
    <div class="search-container">
      <div class="search-field-container">
        <div class="search-field">
          <v-text-field id="keyboard" v-model="searchTerms" prepend-inner-icon="search"></v-text-field>
          <v-icon @click="toggleKeyboard">keyboard</v-icon>
          <v-btn class="search-button" color="info" @click="searchForBooks">Search</v-btn>
          <div class="search-filters" v-if="searchTerms.length > 0">
            <div @click="changeMode('Books')" :class="['books', {'text-hightlight': mode === 'Books'}]"> Books </div> 
            <div @click="changeMode('All')" :class="['all', {'text-hightlight': mode === 'All'}]"> All </div>
          </div>
        </div>
        <div v-show="showKeyboard" class="keyboard-container">
          <div class="simple-keyboard"></div>
        </div>
      </div>
    </div>
    <div>
      <div v-if="mode === 'Books'">
        <item-card  @cardClicked="showContent" 
                    ref="itemCard"
                    class="card"
                    :key="v.documentName"
                    v-for="v in documents"
                    :name="v.documentName"
                    :terms="searchTerms"
                    :id="v._id"
                    :para="v.paragraphs[4]">
        </item-card>
      </div>
      <div v-else-if="mode === 'All'">
        <item-card  @cardClicked="showContent"
                    ref="itemCard"
                    class="card"
                    :key="vi + 1"
                    v-for="(v, vi) in getParagraphs()"
                    :name="v.name"
                    :terms="searchTerms"
                    :id="v.id"
                    :index="vi"
                    :para="v.paragraph">
        </item-card>        
      </div>
    </div>
  </div>
</template>

<script>
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import vClickOutside from 'v-click-outside';
import Mark from 'mark.js';

import _ from 'lodash';

import ItemCard from './ItemCard';
import DocumentService from '../resources/documentService';

export default {
  directives: {
    clickOutside: vClickOutside.directive
  },

  components: {
    ItemCard,
    Keyboard
  },

  data() {
    return {
      documents: [],
      searchTerms: '',
      showKeyboard: '',
      keyboardTerms: '',
      showKeyboard: false,
      mode: 'Books',
      keyboardOption: {
        usePreview: false,
        stickyShift: false,
        autoAccept: true,
        language: 'ta'
      },
    };
  },

  created() {
    this.getAllDocuments();
  },

  mounted() {
    let that = this;
    let keyboard = new Keyboard({
      onChange: input => onChange(input),
      onKeyPress: button => onKeyPress(button),
      layout: {
    'default' : [
        /* ா    ி    ீ    ு    ூ    ெ    ே    ை    ொ    ோ    ௌ    ஃ  */
        "\u0BBE \u0BBF \u0BC0 \u0BC1 \u0BC2 \u0BC6 \u0BC7 \u0BC8 \u0BCA \u0BCB \u0BCC \u0B83 {bksp}",
        /*      ஆ     ஈ      ஊ     ஐ    ஏ      ள      ற     ன     ட      ண   ச      ஞ   \   */
        "{tab} \u0b86 \u0b88 \u0b8a \u0b90 \u0b8f \u0bb3 \u0bb1 \u0ba9 \u0b9f \u0ba3 \u0b9a \u0b9e ",
        /*  அ    இ      உ     ்       எ      க      ப    ம      த      ந      ய  */
        "\u0b85 \u0b87  \u0b89 \u0bcd  \u0b8e  \u0b95 \u0baa \u0bae \u0ba4 \u0ba8 \u0baf {enter}",
        /*         ஔ    ஒ      ஓ    வ     ங     ல      ர    , . ழ    */
        "{shift} \u0b94 \u0b93 \u0b92 \u0bb5 \u0b99 \u0bb2 \u0bb0 , . \u0bb4 {shift}",
        "{accept} {alt} {space} {alt} {cancel}"
    ],
    'shift' : [
         /* numeric key row */
        "`      1      2       3      4     5     6   7  8  9  0 -  =  {bksp}",
        /* sanskrit row */
        /*     ஸ      ஷ        ஜ      ஹ           ஶ்ரீ                       க்ஷ                       */
        "{tab} \u0bb8  \u0bb7  \u0b9c   \u0bb9  \u0bb6\u0bcd\u0bb0\u0bc0  \u0b95\u0bcd\u0bb7 \u0020  [ ]  { } ",
        /* ௹     ௺    ௸     ஃ  \u0020 \u0020 \u0020 \" : ; \' {enter} */
        "\u0bf9 \u0bfa \u0bf8 \u0b83 \u0020 \u0020 \u0020 \" : ; \' {enter}",
        /* ௳ ௴ ௵ ௶ ௷ */
        "{shift} \u0bf3 \u0bf4 \u0bf5 \u0bf6 \u0bf7 \u0020 / \u0020 \u0020 / {shift}",
        "{accept} {alt} {space} {alt} {cancel}"
    ]

}
    });

    function onChange(input){
      that.searchTerms = input;
    }

    function onKeyPress(button){
      if (button === '{cancel}') {
        that.searchTerms = '';
        Keyboard.clearInput();
        that.showKeyboard = false;
      } else if (button === '{backspace}') {
        // that.searchTerms = that.searchTerms.substr(0, that.searchTerms.length - 1);
      }
    }
  },
  

  methods: {
    getParagraphs() {
      let p = [];
      this.documents.forEach((d) => {
        p.push(this.getPara(d));
      })
      return _.flatten(p);
    },

    changeMode(mode) {
      this.mode = mode;
      this.markTerms();
    },

    getParas(paragraphs) {
      return paragraphs.filter(p => p.includes(this.searchTerms));
    },

    getPara(document) {
      let paras = this.getParas(document.paragraphs);
      let constructedParaObj = [];

      paras.forEach((p) => {
        if (p.length > 0) {
          let obj = {
            id: document._id,
            name: document.documentName,
            paragraph: p
          }
          constructedParaObj.push(obj);
        }
      });
      return constructedParaObj;
    },

    getIndicesOf(searchStr, str) {
      var searchStrLen = searchStr.length;
      if (searchStrLen == 0) {
          return [];
      }
      var startIndex = 0, index, indices = [];
      while ((index = str.indexOf(searchStr, startIndex)) > -1) {
          indices.push(index);
          startIndex = index + searchStrLen;
      }
      return indices;
    },
  
    toggleKeyboard() {
      this.showKeyboard = !this.showKeyboard;
    },

    hideKeyboard() {
      this.showKeyboard = false;
    },
    
    searchForBooks() {
      this.$nextTick(() => {
        let payload = {
          terms: this.searchTerms.length > 0 ? this.searchTerms : undefined,
          limit: this.limit ? this.limit : undefined
        }
        DocumentService.getDocuments(payload).then((data) => {
          this.documents = data.body;
          this.markTerms();
        }, (err) => {
          this.errorMessage = 'Unable to fetch documents';
          this.$bus.emit('snackOn', this.errorMessage);
        })
      });
    },

    markTerms() {
      this.$nextTick(() => {
        var context = document.querySelectorAll('.paragraphs');
        var instance = new Mark(context);
        instance.mark(this.searchTerms);
      });
    },

    getAllDocuments() {
      this.isError = false;
      DocumentService.getDocuments().then((data) => {
        this.documents = data.body;
      }, (err) => {
        this.errorMessage = 'Unable to fetch documents';
        this.isError = true;
      })
    },
    
    showContent(content) {
      this.$router.push({path: 'books/viewer/' + content.id, query: { terms: this.searchTerms, index: content.index }});
    }
  }
};
</script>

<style>

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

.keyboard-wrapper {
  border: 1px solid black;
  height: 35px;
  width: 200px;
  padding: 5px;
}

.search-field {
  cursor: pointer;
  width: 430px;
  display: flex;
}

.simple-keyboard {
  width: 600px;
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

.text-hightlight {
  color: lightseagreen;
  text-decoration: underline;
}

.books, .all {
  padding: 10px;
}

.search-button {
  align-self: center;
}
</style>
