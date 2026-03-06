import api from './api'

export const authService = {
  async login(username, password) {
    const res = await api.post('/auth/login', { username, password })
    return res.data
  },
  async register(data) {
    const res = await api.post('/auth/register', data)
    return res.data
  },
  async me() {
    const res = await api.get('/auth/me')
    return res.data
  },
}
