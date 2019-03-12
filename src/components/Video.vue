<template>
  <div>
    <div class="video-container" v-for="video in videos" :key="video.name">
      <span class="video-title"> {{ video.name }} </span>
      <iframe :src="video.src" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videos: [
        {
          name: 'Intro to Web Design',
          src: 'https://youtu.be/F4fbwKV9dBU'
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
  font-size: 1rem;
}
</style>