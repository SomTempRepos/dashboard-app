import axiosInstance from './axios'

export const getMyTeams = () =>
  axiosInstance.get('/teams/').then((res) => res.data)

export const getTeam = (team_id) =>
  axiosInstance.get(`/teams/${team_id}`).then((res) => res.data)

export const createTeam = (data) =>
  axiosInstance.post('/teams/', { name: data.name })

export const updateTeam = (team_id, data) =>
  axiosInstance.put(`/teams/${team_id}`, { name: data.name })

export const deleteTeam = (team_id) =>
  axiosInstance.delete(`/teams/${team_id}`)

export const addMember = (team_id, email) =>
  axiosInstance.post(`/teams/${team_id}/members`, { email })

export const removeMember = (team_id, user_id) =>
  axiosInstance.delete(`/teams/${team_id}/members/${user_id}`)

export const getTeamProgress = (team_id) =>
  axiosInstance.get(`/teams/${team_id}/progress`).then((res) => res.data)