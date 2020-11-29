<template>
  <div>
    <div class="about-container">
      <div class="about-image">
        <info-card></info-card>
      </div>
    </div>
  </div>
</template>

<script>
import InfoCard from './InfoCard';

export default {
  components: {
    InfoCard
  }
};
</script>

<style scoped>
.about-container {
  padding: 10px;
}
</style>