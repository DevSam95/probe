<template>
  <div>
    <div class="app-container">

      <div>
        <div class="prober">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
 
export default {
  data() {
    return {
      activeTab: 'Home',
      errorMessage: ''
    }
  },

  created() {
    this.route();
  },

  methods: {

  }
}
</script>

<style scoped>

</style>
