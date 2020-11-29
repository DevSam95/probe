<template>
  <div>
    <div class="video-container" v-for="video in videos" :key="video.name">
      <span class="video-title"> {{ video.name }} </span>
      <iframe v-if="video.src" :src="video.src" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videos: [
        {
          name: 'Coming Soon...',
        }
      ]
    }
  }
}
</script>

<style scoped>
.video-container {
  display: flex;
  flex-direction: column;
}

.video-title {
  align-self: center;
  font-size: 30px;
}
</style>