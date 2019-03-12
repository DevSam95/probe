<template>
  <div>
    <v-carousel hide-delimiters>
      <v-carousel-item
        v-for="(item, i) in getBgs()"
        :key="i"
        :src="item"
      ></v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  methods: {
    getBgs() {
      const allFiles = (ctx => {
        let keys = ctx.keys();
        let values = keys.map(ctx);
        return keys.reduce((o, k, i) => { o[k] = values[i]; return o; }, {});
      })(require.context('../assets/images/carousel', true, /.*.jpg/));
      return allFiles;
    }
  }
};
</script>

<style scoped>
.text-top {
  font-size: 1.2vw;
  margin-top: 5vw;
  margin-left: 5vw;
  max-width: 400px; 
  color: white;
  font-weight: bold;
}

.text-bottom {
  font-size: 1.2vw;
  margin-left: 5vw;
  margin-top: 20vh;
  max-width: 400px; 
  color: white;
  font-weight: bold;
}
</style>