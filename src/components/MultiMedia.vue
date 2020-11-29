<template>
  <div>
    <div class="multimedia-container">
      <div>
        <v-tabs
          v-model="activeTab"
          color="black"
          dark
          slider-color="yellow"
        >
          <v-tab
            v-for="(tab, i) in tabs"
            :key="i + 1"
            ripple
            @click="tabClicked"
          >
            {{ tab }}
          </v-tab>
          <v-tab-item
            v-for="tab in tabs"
            :key="tab">
            <template>
              <video-c v-if="activeTab === 0"></video-c>
            </template>
          </v-tab-item>
      </v-tabs>
    </div>
  </div>
  </div>
</template>

<script>
import VideoC from './Video.vue';

export default {
  components: {
    VideoC
  },

  data() {
    return {
      tabs: [
        'Video',
        'Audio',
        'Images'
      ],
      activeTab: 0
    }
  },

  methods: {
    tabClicked() {
      console.log(this.activeTab)
    }
  }
};
</script>

<style scoped>
.multimedia-container {
  padding: 10px;
}
</style>