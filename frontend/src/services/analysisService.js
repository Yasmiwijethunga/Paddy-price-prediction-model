import api from './api'

export const analysisService = {
  async getSummary()         { return (await api.get('/analysis/summary')).data },
  async getTrends()          { return (await api.get('/analysis/trends')).data },
  async getByYear(year)      { return (await api.get(`/analysis/by-year/${year}`)).data },
  async getCorrelations()    { return (await api.get('/analysis/correlations')).data },
}
