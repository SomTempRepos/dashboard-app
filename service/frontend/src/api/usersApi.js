import axiosInstance from './axios'

export const getMe = () => axiosInstance.get('/users/me').then((res) => res.data)

export const lookupByEmail = (email) =>
  axiosInstance.get('/users/lookup', { params: { email } }).then((res) => res.data)

export const lookupByCode = (userCode) =>
  axiosInstance.get(`/users/by-code/${userCode}`).then((res) => res.data)

export const batchLookup = (userIds) =>
  axiosInstance
    .post('/users/batch', { user_ids: userIds })
    .then((res) => res.data)
