import api from './api'

export const recordService = {
  async getAll(params)      { return (await api.get('/records/', { params })).data },
  async getYears()          { return (await api.get('/records/years')).data },
  async getById(id)         { return (await api.get(`/records/${id}`)).data },
}
