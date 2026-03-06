import api from './api'

export const predictionService = {
  async run(payload)        { return (await api.post('/predictions/run', payload)).data },
  async myHistory()         { return (await api.get('/predictions/history')).data },
  async allHistory()        { return (await api.get('/predictions/history/all')).data },
  async getById(id)         { return (await api.get(`/predictions/${id}`)).data },
}
