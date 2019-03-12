<template>
  <div>
    <v-container fill-height>
      <v-layout row wrap align-center>
        <v-flex class="text-xs-center">
          <v-container class="login-container">
            <v-card>
              <v-card-title primary-title>
                <h4>Login</h4>
              </v-card-title>
              <v-form class="login-form">
              <v-text-field :error-messages="errorMessages" prepend-icon="person" v-model="userName" name="Username" label="Username"></v-text-field>
              <v-text-field :error-messages="errorMessages" prepend-icon="lock" v-model="password" name="Password" label="Password" type="password"></v-text-field>
              <v-card-actions>
                <v-btn class="login-button" color="#3685B5" large block @click="login">Login</v-btn>
              </v-card-actions>
              </v-form>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import users from '../assets/users.json';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      userName: '',
      password: '',
      errorMessages: ''
    }
  },

  methods: {
    login() {
      users.users.forEach((v) => {
        if (v.name === this.userName && v.password === this.password) {
          this.setLoginStatus(true);
          this.$router.push('/home');
        } else {
          this.errorMessages = 'Invalid Username or Password';
        }
      });
    },

    ...mapActions(['setLoginStatus'])
  }
}
</script>

<style scoped>
.card {
  cursor: pointer;
}

.login-form {
  padding: 15px;
  box-sizing: content-box;
}

.login-button {
  color: white;
}
</style>
