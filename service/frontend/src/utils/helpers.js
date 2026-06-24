import dayjs from 'dayjs'

export const getStatusColor = (status) => {
  switch (status) {
    case 'new':
      return 'default'
    case 'in-progress':
      return 'processing'
    case 'completed':
      return 'success'
    default:
      return 'default'
  }
}

export const getStatusLabel = (status) => {
  switch (status) {
    case 'new':
      return 'New'
    case 'in-progress':
      return 'In Progress'
    case 'completed':
      return 'Completed'
    default:
      return status
  }
}

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'low':
      return 'green'
    case 'medium':
      return 'orange'
    case 'high':
      return 'red'
    default:
      return 'default'
  }
}

export const formatDate = (dateString) => {
  if (!dateString) return 'No due date'
  return dayjs(dateString).format('DD MMM YYYY')
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return dayjs(dateString).format('DD MMM YYYY HH:mm')
}

export const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length > maxLength) return text.slice(0, maxLength) + '...'
  return text
}