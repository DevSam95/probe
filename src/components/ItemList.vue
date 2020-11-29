<template>
    <div>
        <v-layout row>
            <v-flex xs12>
                <v-card>
                    <v-list two-line>
                        <v-list-tile
                            v-for="item in items"
                            :key="item._id"
                            avatar
                            dense
                            :class="['list-item', {'highlighted' : activeItemId ? activeItemId === item.id : item.id === items[0].id}]"
                        >
                            <v-list-tile-content @click="itemClicked(item)" class="list-title">
                                <v-list-tile-title 
                                    v-text="getDate(item.title)">
                                </v-list-tile-title>
                                    {{ getTitle(item.title) }}
                            </v-list-tile-content>

                            <v-list-tile-action v-if="isLoggedIn">
                                <v-icon @click="deleteDocument(item)" color="white">delete</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog
            v-model="showDialog"
            max-width="500"
        >
            <v-card>
                <v-card-title class="headline">Are you sure?</v-card-title>

                <v-card-text>
                You are about to delete <b>{{  selectedForDelete ? selectedForDelete.name : '' }}</b>. This action is irreversible.
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    flat="flat"
                    @click="showDialog = false"
                >
                    Cancel
                </v-btn>
                <v-btn
                    flat="flat"
                    @click="doDelete"
                    color="error"
                >
                    Delete
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>    
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },

    data() {
        return {
            showDialog: false,
            selectedForDelete: null,
            activeItemId: null
        };
    },
    
    computed: {
        ...mapGetters(['isLoggedIn'])
    },

    methods: {
        getDate(title) {
            return title.substr(0, 8);
        },

        getTitle(title) {
            return title.substr(9, title.length);
        },        

        itemClicked(item) {
            this.activeItemId = item.id;
            this.$emit('itemSelected', item);
        },
        deleteDocument(item) {
            this.showDialog = true;
            this.selectedForDelete = item;
        },
        doDelete() {
            this.$emit('deleteSelected', this.selectedForDelete);
            this.showDialog = false;
        }
    }

};
</script>

<style scoped>
.highlighted {
    background-color: #87cefa;
    font-weight: 600 !important;
}

.list-item:hover {
    background-color: #87cefa;
    cursor: pointer;
}

.list-item:nth-of-type(odd) {
    background-color: #f5f5f6;
}

.list-item.highlighted:nth-of-type(odd) {
    background-color: #87cefa;
}

.list-item:nth-of-type(odd):hover {
    background-color: #87cefa;
}

.list-item:nth-of-type(odd):hover {
    background-color: #87cefa;
}

.list-item {
    padding: 5px;
    font-size: 12px;
    font-weight: 700 !important;
}

.list-subtitle {
    font-size: 13px;
    font-weight: 700;
}

.list-title {
    font-size: 13px;
    font-weight: 700;
}
</style>
