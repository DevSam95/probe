<template>
  <div :id="id" @click="cardClicked()">
    <v-hover>
      <v-card 
        slot-scope="{hover}"
        :class="`elevation-${hover ? 12 : 2}`"
        class="card mx-auto" 
        :ripple="!isLoggedIn">

        <div v-show="isSeen" class="done-icon-container">
          <v-btn icon small depressed color="green">
            <v-icon class="done-icon" color="white">done</v-icon>
          </v-btn>
        </div>
        
        <v-card-title>
          <div>
            <h3 class="mb-8 book-title"> {{ getName(name) }} </h3>
            <div class="paragraphs">
              <div v-html="para"></div>
            </div>
          </div>
        </v-card-title>
        <div class="delete-icon" v-if="isLoggedIn && terms.length === 0">
          <v-btn flat icon color="red" @click="showDeletePopup">
            <v-icon>delete</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import Mark from 'mark.js';
import { mapGetters } from 'vuex';

export default {
  props: {
    index: {
      type: [Number, String],
      default: 0
    },
    seenParas: {
      type: Array,
      default: () => []
    },
    id: {
      type: [Number, String],
      default: 0
    },

    data: {
      type: Object,
      default: () => {}
    },
    name: {
      type: String,
      default: ''
    },
    para: {
      type: [Array, String],
      default: () => []
    },
    terms: {
      type: String,
      default: ''
    }
  },

  computed: {
    isSeen() {
      return this.seenParas.includes(this.id);
    },

    ...mapGetters(['isLoggedIn'])
  },

  methods: {
    showDeletePopup() {
      this.showDialog = true;
    },

    getName(name) {
      return name.indexOf('.docx') !== -1 ? name.substr(0, name.length - 5) : name;
    },

    cardClicked() {
      this.$emit('cardClicked', {name: this.name, index: this.index, paraId: this.id });
    }
  }
}
</script>

<style scoped>
.card {
  cursor: pointer;
  padding: 10px;
}
.book-title {
  padding-bottom: 10px;
}
.delete-icon {
  position: absolute;
  right: 15px;
  bottom: 10px;
}

.done-icon-container {
  position: absolute;
  right: 0;
}
</style>
