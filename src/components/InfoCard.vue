<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-img
          :src="images.about"
          :max-width="320"
          :max-heght="300"
        ></v-img>

        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{ title }}</h3>
            <div class="description" v-html="description"></div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="orange">Contact Us</v-btn>
          <v-btn flat color="orange" href="mailto:dkdavid@gmail.com">Email</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import about from '../assets/images/david.jpg'

export default {
  data() {
    return {
      images: {
        about: about
      },
      title: 'The Last Voice Ministry',
      description: '<div>N David</div><div>9940808951</div><div>Karaikal</div>'
    };
  },

  methods: {
    emailTo() {

    }
  }
}

</script>

<style scoped>
.description {
  font-size: 1rem;
  font-weight: 600;
}
</style>