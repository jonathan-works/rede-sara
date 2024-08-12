import { api } from 'boot/axios'

export default function useApi(url) {

  const list = async (headers = null) => {
    try {
      const { data } = await api.get(url, headers)
      return data
    } catch (error) {
      throw error
    }
  }
  const getById = async (id) => {
    try {
      const { data } = await api.get(url + id)
      return data
    } catch (error) {
      throw error
    }
  }
  const post = async (form, headers = null) => {
    try {
      const { data } = await api.post(url, form, headers)
      return data
    } catch (error) {
      throw error
    }
  }
  const update = async (form) => {
    try {
      const { data } = await api.put(`${url}/${form.id}`, form)
      return data
    } catch (error) {
      throw error
    }
  }
  const patch = async (form) => {
    try {
      const { data } = await api.patch(`${url}/${form.id}`, form)
      return data
    } catch (error) {
      throw error
    }
  }
  const remove = async (id) => {
    const { data } = await api.delete(`${url}/${id}`)
    return data;
  };

  return {
    list,
    post,
    update,
    patch,
    remove,
    getById
  }
}
