const state = {
  isLoggedIn: false
}

const getters = {
  isLoggedIn: state => state.isLoggedIn
}

const actions = {
  setLoginStatus({commit}, payload) {
    commit('SET_LOGIN', payload);
  }
}

const mutations = {
  SET_LOGIN(state, payload) {
    state.isLoggedIn = payload;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
};
