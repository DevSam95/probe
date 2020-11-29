<template>
  <v-app>
    <v-toolbar :height="60" color="white" app>
      <v-img :src="images.bible" :max-height="50" :max-width="50"></v-img>
      <v-spacer></v-spacer>
        <div class="justify-center">
          <v-toolbar-title>
            <div class="title-container">
              <div class="app-title">{{ appName }}</div>
            </div>
          </v-toolbar-title>
        </div>
        <v-spacer></v-spacer>
        <v-img :src="images.eagle" :max-height="50" :max-width="50"></v-img>
    </v-toolbar>

    <v-content class="main-container">
      <div>
        <div class="app-menu">
          <div @click="updateMenu(item)" :class="['menu-item', {'active-menu': $route.name === item}]" v-for="item in items" :key="item">
            {{ item }}
          </div>
          <div>
            <v-menu>
              <template v-slot:activator="{ on }">
                <div class="menu-item" v-on="on">
                  Downloads
                </div>
              </template>
                <v-list>
                  <v-list-tile
                    v-for="(item, index) in subMenuItems"
                    :key="index"
                    :name="item.name"
                    @click="goToLink(item)">
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
            </v-menu>

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
        <div v-show="isScrolled" class="scroll-top">
          <v-btn fab dark color="#f44336" @click="scrollTop">
            <v-icon>arrow_upward</v-icon>
          </v-btn>
        </div>
      </div>
      <v-dialog max-width="500" v-model="showDownloadDialog">
        <!-- <downloader @cancel="showDownloadDialog = false"></downloader> -->
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import eagle from './assets/images/eagle.png';
import bible from './assets/images/bible_logo.jpg';

import { mapActions, mapGetters } from 'vuex';

import Downloader from './components/Downloader';

export default {
  name: 'App',

  data () {
    return {
      loginStatus: false,
      showDownloadDialog: false,
      mode: 'probe',
      appName: 'The Last Voice Ministry',
      snackMessage: '',
      activeTab: 'Home',
      showSnack: false,
      isScrolled: false,
      images: {
        eagle,
        bible
      },
      items: [
        'Home',
        'Tamil Messages',
        // 'MultiMedia',
        'About',
        'Help'
        // 'Update'
      ],
      subMenuItems: [
        {
          name: 'ta-b',
          title: 'Tamil - Books'
        },
        {
          name: 'ta-t',
          title: 'Tamil - Tracts'
        },
        {
          name: 'ta-s',
          title: 'Tamil - Softwares'
        }
      ]
    }
  },

  components: {
    Downloader
  },

  created() {
    window.addEventListener('scroll', this.handleScroll);
    this.$bus.on('snackOn', this.handleSnack);
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
    this.$bus.off();
  },

  computed: {
    ...mapGetters(['isLoggedIn'])
  },

  methods: {
    handleScroll(event) {
      this.isScrolled = window.pageYOffset > 200;
    },

    scrollTop() {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    },

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
        case 'Tamil Messages': 
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
        case 'Update':
          this.showDownloadDialog = true;
          break;
        case 'Downloads':
          window.location = 'http://www.thelastvoicemessage.com/downloader/message.html'
          break;
        case 'Help':
          window.location = 'http://www.thelastvoicemessage.com/downloader/help.html'
          break;
        default:
          this.$router.push('/');
      }
    },

    goToLink(item) {
      switch (item.name) {
        case 'ta-b':
          window.location = 'http://www.thelastvoicemessage.com/downloader/tamil_books.html';
          break;
        case 'ta-t':
          window.location = 'http://www.thelastvoicemessage.com/downloader/tamil_tracts.html';
          break;
        case 'ta-s':
          window.location = 'http://www.thelastvoicemessage.com/downloader/tamil_softwares.html';
          break;
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
.scroll-top {
  position: fixed;
  bottom: 15px;
  right: 15px;
}

.main-container {
  background-color: #F7F7FF;
}

.title-container {
  display: flex;
  text-transform: uppercase;
}

.app-title {
  margin-left: 10px;
  font-size: 2vw;
  font-weight: 800;
  color: #000000;
  letter-spacing: 5px;
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
  padding: 5px;
}

.search-field {
  margin-left: 50px;
}

.prober {
  overflow: auto;
  border: 1px solid #DCDCDC;
}

.app-menu {
  display: flex;
  color: white;
  position: sticky;
  top: 60px;
  z-index: 99;
}

.menu-item {
  padding: 10px;
  cursor: pointer;
  letter-spacing: 2px;
  font-weight: 600;
}

.menu-item:hover {
  color: #87cefa;
  background-color: #FFF;
  font-weight: 600;
}

.back {
  cursor: pointer;
}

.active-menu {
  color: #000000;
  font-weight: 600;
  background-color: white;
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

.app-menu {
  background-color: #87cefa;
  color: black; 
}
</style>