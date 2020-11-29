<template>
    <div>
        <div class="search-container">
            <div class="search-field-container">
                <div class="search-field">
                    <v-text-field
                        width="400px"
                        name="default-tamil"
                        color="#87cefa"
                        placeholder="Search"
                        v-model="searchTerms"
                        @keydown="toggleKB"
                        @keypress="convert"
                        @click:clear="resetSearchTerms"
                        clearable>
                    </v-text-field>

                    <tooltip  :text="'Keyboard'" :color="'#87cefa'">
                        <v-btn slot="content" icon class="keyboard-icon">
                            <v-icon @click="toggleKeyboard">keyboard</v-icon>
                        </v-btn>
                    </tooltip>

                    <div class="search-button-container">
                        <v-btn color="#87cefa" icon small @click="searchForParas">
                            <v-icon>search</v-icon>
                        </v-btn>
                    </div>
                </div>
                <div class="result-count">
                    <div v-if="seenParas.length > 0">
                        <strong> {{ seenParas.length }} </strong> of <strong>{{ paragraphs.length }}</strong> result(s) seen.
                    </div>
                    <div>
                        Total <strong>{{ count }}</strong>.
                    </div>
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
            <span v-if="isMobile" v-show="paragraphs.length === 0" @click="$emit('hideParaSearch')">
                <v-btn>
                    Go Back!
                </v-btn>
            </span>
            <item-card  @cardClicked="showContent"
                        ref="itemCard"
                        class="card"
                        v-for="v in paragraphs"
                        :seenParas="seenParas"
                        :key="v._id"
                        :name="v.documentName"
                        :id="v._id"
                        :index="v.pid"
                        :para="v.paragraph">
            </item-card>
        </div>
    </div>
</template>

<script>
import ItemCard from './ItemCard';
import SimpleKeyboard from './SimpleKeybard';
import Tooltip from './Tooltip';

import { toggleKBMode, convertThis } from '../plugins/common.js';

import DocumentService from '../resources/documentService';

import Mark from 'mark.js';

export default {
    components: { ItemCard, SimpleKeyboard, Tooltip },

    data() {
        return {
            searchTerms: '',
            paragraphs: [],
            count: 0,
            seenParas: [],
            showKeyboard: false,
            isMobile: !this.$vuetify.breakpoint.mdAndUp
        };
    },

    watch: {
        searchTerms(n) {
            this.getParaCount();
        }
    },

    methods: {
        convert($event) {
            convertThis($event);
        },

        toggleKB($event) {
            toggleKBMode($event);
            // convertThis($event);
            console.log($event);
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

        searchForParas() {
            this.$emit('updateTerms', this.searchTerms);
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

        showContent(item) {
            this.seenParas.push(item.paraId);
            this.$emit('showContent', item);
        },

        resetSearchTerms() {
            this.searchTerms = '';
            this.paragraphs = [];
            this.seenParas = [];
            this.$emit('resetSearchTerms');
        },

        markTerms() {
            this.$emit('termsMarked');
        },

        getParaCount() {
            let terms = this.wrapWordsWithQuotes(this.searchTerms);
            DocumentService.getCount({ terms }).then((data) => {
                this.count = data.body;
            });
        },

        toggleKeyboard() {
            this.showKeyboard = !this.showKeyboard;
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

    .search-button-container {
        display: flex;
        align-items: center;
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
        z-index: 99;
    }

    .keyboard-container {
        background-color: white;
        position: absolute;
        z-index: 99;
    }
</style>