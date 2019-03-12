<template>
  <v-app>
    <v-toolbar :height="120" scroll-toolbar-off-screen app>
      <v-spacer></v-spacer>
        <div class="justify-center">
          <v-toolbar-title>
            <div class="title-container">
              <svg style="width:40px;height:40px" viewBox="0 0 24 24">
                <path fill="#000" d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.5 6.5,20.5C8.45,20.5 10.55,20.9 12,22C13.35,21.15 15.8,20.5 17.5,20.5C19.15,20.5 20.85,20.81 22.25,21.56C22.35,21.61 22.4,21.59 22.5,21.59C22.75,21.59 23,21.34 23,21.09V6.5C22.4,6.05 21.75,5.75 21,5.5V7.5L21,13V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,19.15 12,20V13L12,8.5V6.5C10.55,5.4 8.45,5 6.5,5V5Z" />
              </svg>
              <div class="app-title">{{ appName }}</div>
            </div>
          </v-toolbar-title>
        </div>
      <v-spacer></v-spacer>
      <v-img :src="images.eagle" :max-height=100 :max-width=120></v-img>
    </v-toolbar>

    <v-content class="main-container">
      <div>
        <div class="app-menu">
          <div @click="updateMenu(item)" :class="['menu-item', {'active-menu': $route.name === item}]" v-for="item in items" :key="item">
            {{ item }}
          </div>
          <div class="user-icon">
            <div @click="handleLogin" style="color: white; cursor: pointer"> 
              {{ isLoggedIn ? 'Logout' : 'Login' }}
            </div>
          </div>
        </div>
        <div class="app-container">
          <div>
            <div class="prober">
              <router-view></router-view>
            </div>
          </div>
        </div>
        <v-snackbar v-model="showSnack">{{ snackMessage }}</v-snackbar>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import eagle from './assets/images/eagle.png';

import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',

  data () {
    return {
      loginStatus: false,
      mode: 'probe',
      appName: 'The Last Voice Ministry',
      snackMessage: '',
      activeTab: 'Home',
      showSnack: false,
      images: {
        eagle: eagle
      },
      items: [
        'Home',
        'Tamil Books',
        'MultiMedia',
        'About'
      ]
    }
  },

  created() {
    this.$bus.on('snackOn', this.handleSnack);
  },

  destroyed() {
    this.$bus.off();
  },

  computed: {
    ...mapGetters(['isLoggedIn'])
  },

  methods: {
    handleSnack(snackMessage) {
      this.snackMessage = snackMessage;
      this.showSnack = true;
    },

    handleLogin() {
      if (this.isLoggedIn) {
        this.setLoginStatus(false);
        this.$router.push('/home')
      } else {
        this.$router.push('/login');
      }
    },

    updateMenu(menuItem) {
      this.activeTab = menuItem;
      this.route();
    },

    route() {
      let route = this.activeTab;
      switch (route) {
        case 'Tamil Books': 
          this.$router.push('/books');
          break;
        case 'About':
          this.$router.push('/about');
          break;
        case 'Upload':
          this.$router.push('/upload');
          break;
        case 'Home':
          this.$router.push('/home');
          break;
        case 'MultiMedia':
          this.$router.push('/media');
          break;
        case 'Login':
          this.$router.push('/login');
          break;           
        default:
          this.$router.push('/');
      }
    },

    ...mapActions(['setLoginStatus']) 
  },
  
  watch: {
    'isLoggedIn': function(n) {
      if (n) {
        this.items.push('Upload');
      } else {
        let i = this.items.indexOf('Upload');
        if (i !== -1) {
          this.items = this.items.splice(0, i);
        }
      }
    }
  }
}
</script>

<style scoped>
.main-container {
  background-color: #F7F7FF;
}

.title-container {
  display: flex;
  text-transform: uppercase;
}

.app-title {
  margin-left: 10px;
  font-size: 30px;
  font-weight: 800;
}

.menu {
  text-align: left;
  background-color: black;
}

.side-nav {
  width: 200px;
  height: 87vh;
  overflow-y: auto;
}

.search-container {
  display: flex;
}

.search-field {
  margin-left: 50px;
}

.prober {
  margin: 20px;
  padding: 10px;
  overflow: auto;
  border: 1px solid #DCDCDC;
}

.app-menu {
  display: flex;
  background-color: #1E1711;
  color: white;
}

.menu-item {
  padding: 10px;
  cursor: pointer;
}

.menu-item:hover {
  color: black;
  background-color: #FFF;
}

.back {
  cursor: pointer;
}

.active-menu {
  color: black;
  background-color: #F7F7FF;
}

.form-text {
  width: 400px;
}

.upload {
  border: 1px solid #B1B1B1;
  padding: 20px;
}

.user-icon {
  position: absolute;
  align-self: center;
  right: 10px;
}
</style>