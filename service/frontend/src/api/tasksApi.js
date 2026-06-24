import axiosInstance from './axios'

export const getAllMyTasks = () =>
  axiosInstance.get('/tasks/').then((res) => res.data)

export const getTeamTasks = (team_id) =>
  axiosInstance.get(`/tasks/team/${team_id}`).then((res) => res.data)

export const createTask = (data) => {
  const payload = {
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    assigned_to: data.assigned_to,
    due_date: data.due_date || null,
  }
  if (data.domain) payload.domain = data.domain
  if (data.team_code) payload.team_code = data.team_code
  return axiosInstance.post('/tasks/', payload)
}

export const updateTask = (task_id, data) => {
  const payload = { ...data }
  return axiosInstance.put(`/tasks/${task_id}`, payload)
}

export const deleteTask = (task_id) =>
  axiosInstance.delete(`/tasks/${task_id}`)

export const updateTaskStatus = (task_id, status) =>
  axiosInstance.patch(`/tasks/${task_id}/status`, { status })

export const getComments = (task_id) =>
  axiosInstance.get(`/tasks/${task_id}/comments`).then((res) => res.data)

export const createComment = (task_id, content) =>
  axiosInstance
    .post(`/tasks/${task_id}/comments`, { content })
    .then((res) => res.data)

export const deleteComment = (task_id, comment_id) =>
  axiosInstance.delete(`/tasks/${task_id}/comments/${comment_id}`)