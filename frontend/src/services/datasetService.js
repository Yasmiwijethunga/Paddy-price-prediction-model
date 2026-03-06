import api from './api'

export const datasetService = {
  async upload(file, datasetType) {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('dataset_type', datasetType)
    return (await api.post('/datasets/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })).data
  },
  async getAll()            { return (await api.get('/datasets/')).data },
  async getById(id)         { return (await api.get(`/datasets/${id}`)).data },
  async remove(id)          { return (await api.delete(`/datasets/${id}`)).data },
}
