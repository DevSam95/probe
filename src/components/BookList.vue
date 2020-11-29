<template>
    <div>
        <div class="search-container">
            <div class="search-field-container">
                <div class="search-field">
                    <v-text-field
                        width="400px"
                        name="default-tamil"
                        id="keyboard"
                        color="#87cefa"
                        placeholder="Search"
                        @keypress="toggleKB"
                        v-model="searchTerms"
                        @change="searchForBooks"
                        @click:clear="resetSearchTerms"
                        clearable>
                    </v-text-field>

                    <tooltip  :text="'Keyboard'" :color="'#87cefa'">
                        <v-btn slot="content" icon class="keyboard-icon">
                            <v-icon @click="toggleKeyboard">keyboard</v-icon>
                        </v-btn>
                    </tooltip>
                </div>

                <div class="result-count">
                    <span><b>{{ items.length }}</b> books found</span>
                </div>
            </div>
        </div>

        <div v-if="showKeyboard" class="keyboard-container">
            <simple-keyboard  class="simple-keyboard" 
                            id="simpleKeyboard"
                            :input="searchTerms"
                            @change="onChange"
                            @keyPress="onKeyPress">
            </simple-keyboard>
        </div>

        <div class="results-container">
            <item-list :items="items"
                        class="card"
                        @deleteSelected="deleteDocument"
                        @itemSelected="showContent">
            </item-list>
        </div>
    </div>
</template>

<script>
import ItemList from './ItemList';
import SimpleKeyboard from './SimpleKeybard';
import { toggleKBMode, convertThis } from '../plugins/common.js';

import Tooltip from './Tooltip';

export default {
    props: {
        documents: {
            type: Array,
            default: () => []
        }
    },

    data() {
        return {
            searchTerms: '',
            items: [],
            showKeyboard: false
        };
    },

    components: { ItemList, SimpleKeyboard, Tooltip },

    watch: {
        searchTerms(n) {
            this.items = n && n.length > 0 ? this.searchForBooks() : this.getListItems();
        },

        documents(n) {
            this.items = this.getListItems();
        }
    },

    methods: {
        toggleKB($event) {
            toggleKBMode($event);
            convertThis($event);
        },

        toggleKeyboard() {
            this.showKeyboard = !this.showKeyboard;
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

        searchForBooks(terms) {
            // ---------------------------------------------------------------------
            // Filtering Can be done in UI because for a language, books cannot exceed 1000.
            // There should be no performance penalty! Uses native `for loop` for max performance.
            // ------------------------------------------------------------------------
            let docs = [];
            let doc;
            for (doc of this.documents) {
                const docHasName = doc.documentName.includes(terms || this.searchTerms);
                if (docHasName) {
                    docs.push({
                        title: this.getName(doc.documentName),
                        icon: 'book',
                        id: doc._id,
                        content: doc.content ? doc.content : '',
                        name: doc.documentName
                    });
                }
            }
            return docs;
        },

        getListItems() {
            let docs = this.documents;

            let items = docs.map((doc) => {
                return {
                    title: this.getName(doc.documentName),
                    icon: 'book',
                    id: doc._id,
                    content: doc.content || '',
                    name: doc.documentName
                }
            });
            return items;
        },

        getName(name) {
            return name.indexOf('.docx') !== -1 ? name.substr(0, name.length - 5) : name;
        },

        deleteDocument(item) {
            this.$emit('documentDeleted', item);
        },

        showContent(item) {
            this.$emit('itemSelected', item);
        },

        resetSearchTerms() {
            this.searchTerms = '';
            this.$emit('resetSearchTerms');
        },

        updateActiveDocId(docId) {
            this.$emit('updateDocId', docId)
        }
    }

}
</script>

<style scoped>
.search-field {
  cursor: pointer;
  display: flex;
}

.results-container {
  overflow: auto;
  height: 70vh;
}

.result-count {
  color: black;
  display: flex;
  padding-left: 10px;
}

.search-container {
    padding: 5px;
}

.simple-keyboard {
  width: 530px;
}

.keyboard-container {
  background-color: white;
  position: absolute;
  z-index: 99;
}
</style>