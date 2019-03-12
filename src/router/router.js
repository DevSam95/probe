import Vue from 'vue'
import Router from 'vue-router'

import ProbeCenter from '../components/ProbeCenter.vue';
import PdfViewer from '../components/PdfViewer.vue';
import Login from '../components/Login.vue';
import Books from '../components/Books.vue';
import UploadFile from '../components/UploadFile';
import About from '../components/About.vue';
import Home from '../components/Home.vue';
import MultiMedia from '../components/MultiMedia.vue';


Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/books',
      name: 'Tamil Books',
      component: Books  
    },
    {
      path: '/media',
      name: 'MultiMedia',
      component: MultiMedia  
    },        
    {
      path: '/upload',
      name: 'Upload',
      component: UploadFile
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },    
    {
      path: '/books/viewer/:id',
      name: 'Viewer',
      component: PdfViewer  
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})


export default router;

