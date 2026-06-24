import axiosInstance from './axios'

export const register = (data) =>
  axiosInstance.post('/auth/register', {
    name: data.name,
    email: data.email,
    password: data.password,
  })

export const login = (data) =>
  axiosInstance.post('/auth/login', {
    email: data.email,
    password: data.password,
  })

export const logout = () => axiosInstance.post('/auth/logout')

export const resetPassword = (data) =>
  axiosInstance.post('/auth/reset-password', {
    email: data.email,
    new_password: data.new_password,
  })