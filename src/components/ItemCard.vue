<template>
  <div :id="id" @click="cardClicked">
    <v-hover>
      <v-card 
      slot-scope="{hover}"
      :class="`elevation-${hover ? 12 : 2}`"
      class="card mx-auto" 
      ripple>
        <v-card-title>
          <div>
            <h3 class="mb-8 book-title"> {{ getName(name) }} </h3>
            <div class="paragraphs">
              <div v-html="para"></div>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import Mark from 'mark.js';

export default {
  props: {
    index: {
      type: [Number, String],
      default: 0
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

  methods: {
    getName(name) {
      return name.indexOf('.docx') !== -1 ? name.substr(0, name.length - 5) : name;
    },

    markTerms() {
      var context = document.querySelector('.paragraphs');
      var instance = new Mark(context);
      instance.mark(this.terms);
    },

    cardClicked() {
      this.$emit('cardClicked', {id: this.id, index: this.index });
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
</style>
