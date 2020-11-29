<template>
    <div class="download-container">
        <v-card>
            <p>{{ status }}</p>
            <p v-if="progress > 0">Downloading.....</p>
            <v-progress-linear :value="progress"></v-progress-linear>
            <v-btn  :disabled="docsToBeUpdated.length === 0" 
                    @click="updateDocs(docsToBeUpdated)">
                    Update
            </v-btn>
            <v-btn @click="$emit('cancel')">Cancel</v-btn>
        </v-card>
    </div>
</template>

<script>

import DocumentService from '../resources/documentService';

// ToDo: Externalize
const localApiUrl = 'http://localhost:1234';
const remoteApiUrl = 'http://139.59.87.60:1234'; //DigitalOcean.

const UPDATES_AVAILABLE = 'There are updates available!';
const NO_UPDATES = 'There are no updates available!';
const UPDATING = 'Downloading.....';

export default {
    data() {
        return {
            progress: 0,
            docsToBeUpdated: []
        }
    },

    mounted() {
        // this.docsToBeUpdated = this.checkForUpdates();
    },

    computed: {
        status() {
            return this.docsToBeUpdated.length > 0 ? UPDATES_AVAILABLE : NO_UPDATES;
        }
    },

    methods: {
        async updateDocs(itemsToUpdate) {
            if (itemsToUpdate.length > 0) {
                this.message = 'Updating local database....';
                this.progress = 0;
                for (let i = 0; i < itemsToUpdate.length; i++) {
                    let doc = await this.$http.get(`${remoteApiUrl}/docs/readOne/${itemsToUpdate[i]._id}`);
                    if (doc.status === 200) {
                        this.uploadParas(doc.body, itemsToUpdate[i]);
                    }
                    this.progress = (i / itemsToUpdate.length) * 100;
                }
            } else {
                this.message = 'No documents were found locally....Downloading....';
                this.downloadAllData();
            }
        },

        uploadParas(doc, item) {
            this.$http.post(`${localApiUrl}/docs/uploadDoc`, doc, {}).then(async (d) => {
                if (d.status === 200) {
                    const dateAsString = doc.documentName.split(' ')[0].replace(/-/g, '');
                    let paras = doc.content.split(/\<p id="/g).map((p, ind) => {
                        return {
                            paragraph: p ? `<p class=${p}` : ' ',
                            documentName: doc.documentName,
                            pid: dateAsString + (ind) + '',
                            year: doc.year,
                            pindex: ind
                        }
                    });
                    await this.$http.post(`${localApiUrl}/docs/uploadParas`, paras);
                }
            })
        },

        downloadAllData() {
            this.$http.get(`${remoteApiUrl}/docs/readAll`, {
                progress: (e) => {
                    if (e.lengthComputable) {
                        this.progress = e.loaded / e.total * 100;
                    }
                }
            }).then((data) => {
                let documents = data.body;
                this.updateDocs(documents);
            }, (err) => {
                this.errorMessage = 'Unable to fetch documents';
                this.$bus.emit('snackOn', this.errorMessage);
                this.isLoading = false;
            })
        },

        async checkForUpdates() {
            let { body: localDocs } = await this.$http.get(`${localApiUrl}/docs/readAll`);
            let { body: remoteDocs } = await this.$http.get(`${remoteApiUrl}/docs/readAll`);
            let absentItems = [];
            if (localDocs.length !== remoteDocs.length) {
                let localDocIds = localDocs.map(l => l._id);

                for (let i = 0; i < remoteDocs.length; i++) {
                    if (!localDocIds.includes(remoteDocs[i]._id)) {
                        absentItems.push(remoteDocs[i]);
                    }
                }
            }
            return absentItems;
        }
    }
}
</script>

<style scoped>
    .download-container {
        padding: 10px;
        font-size: 16px;
        justify-content: center;
    }
</style>