<template>
  <div>
    <div class="home-container">
      <v-responsive :aspect-ratio="'16/9'">
        <v-carousel hide-delimiters>
          <v-carousel-item
            v-for="(item, i) in getBgs()"
            :key="i"
            :src="item"
          ></v-carousel-item>
        </v-carousel>
      </v-responsive>

      <div class="home-content">
        <div class="image-description">
          <img src="../assets/images/cloud.png" class="desc-image">
          <p class="desc-title">
            இயற்கைக்கு மேம்பட்ட மேகம்
          </p>
          <p class="desc">
            ஏழு முத்திரைகள் திறக்கப்படுவதைக் குறித்து, சகோதரன் பிரான்ஹாமுடன் பேசின பிறகு, மேலே ஏறிச் சென்ற ஏழு தூதர்களின் செட்டைகளினால் உருவாக்கப்பட்டதுதான் இந்த இயற்கைக்கு மேம்பட்ட மேகம் ஆகும். பிப்ரவரி மாதம் 28ம் தேதி, 1963 அன்று சூரிய அஸ்தமன நேரத்தில், ஃபிளேக்ஸ்டாப், அரிசோனாவின் மேல் இந்த மகத்தான மேகம் புகைப்படம் எடுக்கப்பட்டபோது, இது 26 மைல்கள் உயரமும், 30 மைல்கள் அகலமும் வாய்ந்ததாக இருந்தது. இப்புகைப்படமானது முதன்முறையாக மே 17, 1963 அன்று "லைப்” (Life Magazine) பத்திரிகையில் அச்சிடப்பட்டது.
          </p>
        </div>

        <div class="image-description">
          <img src="../assets/images/branham.png" class="desc-image">
          <p class="desc-title">
            அக்கினி ஸ்தம்பம்
          </p>
          <p class="desc">
            சகோதரன் பிரான்ஹாமின் தலைக்குமேலே காணப்படுகிற அக்கினி ஸ்தம்பத்தோடு கூடிய புகைப்படமானது அமெரிக்க ஐக்கிய நாடுகளிலுள்ள டெக்ஸாஸ் மாகாணத்தில் ஹவுஸ்டன் என்னும் இடத்தில் ஜனவரி மாதம் 1950ல் எடுக்கப்பட்டது. இந்த அக்கினி ஸ்தம்பம் அவர் பிறந்த 1909-ம் வருடத்திலிருந்து அவரைத் தொடர்ந்து வந்தது. 
1933ம் ஆண்டில், ஜெபர்ஸன்வில், இந்தியானா, ஓஹையோ ஆற்றில் ஞானஸ்நானம் நேரத்தில் இந்த அற்புத ஒளியானது நூற்றுக்கணக்கான மக்கள் முன்பாக வந்து, "கிறிஸ்துவின் முதலாம் வருகையிலே முன்னோடியாக யோவான் ஸ்நானகன் வந்தது போல, கிறிஸ்துவின் இரண்டாம் வருகையிலே நீ முன்னோடியாக இருப்பாய்'' என்று கூறினது.

          </p>
        </div>
      </div>
    </div>
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
    },

    getAssetsImg(imageName) {
      let ctx = require.context('../assets/images/');
      return ctx(imageName);
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

.home-container {
  padding: 10px;
}

.home-content {
  margin-top: 40px;
  background-color: white; 
}

.image-description {
  padding-top: 50px;
}

.desc-image {
  max-width: 150px;
  max-height: 150px;
  padding-right: 20px;
  padding-bottom: 20px;  
  float: left;
}

.desc-title {
  font-size: 18px;
  text-align: center;
  justify-content: center;
  font-weight: 700;
}

.desc {
  text-align: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
}
</style>