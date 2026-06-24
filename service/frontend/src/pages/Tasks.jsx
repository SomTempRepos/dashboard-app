import { useState } from 'react'
import { Select, Row, Col, Spin, Empty, Grid, App, Input, Tabs, Badge } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/layout/AppLayout'
import PageHeader from '../components/shared/PageHeader'
import TaskTable from '../components/tasks/TaskTable'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'
import TaskDetail from '../components/tasks/TaskDetail'
import * as tasksApi from '../api/tasksApi'
import useAuthStore from '../store/useAuthStore'

const { useBreakpoint } = Grid

export default function Tasks() {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((state) => state.user)

  const [activeScope, setActiveScope] = useState('assigned')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterDomain, setFilterDomain] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [viewingTask, setViewingTask] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['myTasks'],
    queryFn: tasksApi.getAllMyTasks,
  })

  const assignedToMe = tasks.filter((task) =>
    (task.assigned_to || []).includes(currentUser?.id)
  )
  const createdByMe = tasks.filter(
    (task) => task.created_by === currentUser?.id
  )

  const scopedTasks = activeScope === 'assigned' ? assignedToMe : createdByMe

  const filteredTasks = scopedTasks.filter((task) => {
    const statusMatch =
      filterStatus === 'all' || task.status === filterStatus
    const priorityMatch =
      filterPriority === 'all' || task.priority === filterPriority
    const domainMatch =
      !filterDomain.trim() ||
      (task.domain || '')
        .toLowerCase()
        .includes(filterDomain.trim().toLowerCase())
    return statusMatch && priorityMatch && domainMatch
  })

  const handleEdit = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDelete = async (taskId) => {
    try {
      await tasksApi.deleteTask(taskId)
      message.success('Task deleted')
      queryClient.invalidateQueries({ queryKey: ['myTasks'] })
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      await tasksApi.updateTaskStatus(taskId, status)
      message.success('Status updated')
      queryClient.invalidateQueries({ queryKey: ['myTasks'] })
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  const handleView = (task) => {
    setViewingTask(task)
    setIsDetailOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div
          style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}
        >
          <Spin size="large" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageHeader
        title="My Tasks"
        buttonText="+ Add Task"
        onButtonClick={() => {
          setEditingTask(null)
          setIsModalOpen(true)
        }}
      />

      <Tabs
        activeKey={activeScope}
        onChange={setActiveScope}
        style={{ marginBottom: 8 }}
        items={[
          {
            key: 'assigned',
            label: (
              <Badge count={assignedToMe.length} size="small" offset={[8, 0]}>
                <span>Assigned to Me</span>
              </Badge>
            ),
          },
          {
            key: 'created',
            label: (
              <Badge count={createdByMe.length} size="small" offset={[8, 0]}>
                <span>Created by Me</span>
              </Badge>
            ),
          },
        ]}
      />

      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={8} md={5}>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'new', label: 'New' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Select
            value={filterPriority}
            onChange={setFilterPriority}
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: 'All Priority' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="Filter by domain..."
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      {filteredTasks.length === 0 ? (
        <Empty
          description={
            activeScope === 'assigned'
              ? 'No tasks assigned to you yet'
              : "You haven't created any tasks yet"
          }
        />
      ) : isMobile ? (
        filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onView={handleView}
          />
        ))
      ) : (
        <TaskTable
          tasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onView={handleView}
        />
      )}

      <TaskForm
        open={isModalOpen}
        onClose={handleModalClose}
        editingTask={editingTask}
      />

      <TaskDetail
        open={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setViewingTask(null)
        }}
        task={viewingTask}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AppLayout>
  )
}