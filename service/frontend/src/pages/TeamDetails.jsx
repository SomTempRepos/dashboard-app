import { useState } from 'react'
import {
  Row,
  Col,
  Spin,
  Empty,
  Typography,
  Avatar,
  Button,
  Tag,
  List,
  Tabs,
  Modal,
  Drawer,
  Dropdown,
  Form,
  Input,
  Popconfirm,
  App,
  Grid,
  Space,
  Progress,
  Alert,
  Card,
  Statistic,
} from 'antd'
import {
  UserAddOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AppLayout from '../components/layout/AppLayout'
import TaskTable from '../components/tasks/TaskTable'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'
import TaskDetail from '../components/tasks/TaskDetail'
import * as teamsApi from '../api/teamsApi'
import * as tasksApi from '../api/tasksApi'
import useAuthStore from '../store/useAuthStore'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const memberSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
})

const editTeamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
})

export default function TeamDetails() {
  const { id: teamId } = useParams()
  const navigate = useNavigate()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const [activeTab, setActiveTab] = useState('members')
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false)
  const [viewingTask, setViewingTask] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { data: team, isLoading: teamLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamsApi.getTeam(teamId),
  })

  const { data: teamTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['teamTasks', teamId],
    queryFn: () => tasksApi.getTeamTasks(teamId),
  })

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['teamProgress', teamId],
    queryFn: () => teamsApi.getTeamProgress(teamId),
  })

  const isCreator = team?.created_by === user?.id

  const {
    control: memberControl,
    handleSubmit: handleMemberSubmit,
    reset: resetMember,
    formState: { errors: memberErrors, isSubmitting: memberSubmitting },
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: { email: '' },
  })

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: editSubmitting },
  } = useForm({
    resolver: zodResolver(editTeamSchema),
    defaultValues: { name: '' },
  })

  const handleAddMember = async (data) => {
    try {
      await teamsApi.addMember(teamId, data.email)
      message.success('Member added')
      queryClient.invalidateQueries({ queryKey: ['team', teamId] })
      resetMember()
      setIsAddMemberOpen(false)
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  const handleRemoveMember = async (userId) => {
    try {
      await teamsApi.removeMember(teamId, userId)
      message.success('Member removed')
      queryClient.invalidateQueries({ queryKey: ['team', teamId] })
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  const handleEditTeam = async (data) => {
    try {
      await teamsApi.updateTeam(teamId, data)
      message.success('Team updated')
      queryClient.invalidateQueries({ queryKey: ['team', teamId] })
      queryClient.invalidateQueries({ queryKey: ['myTeams'] })
      resetEdit()
      setIsEditTeamOpen(false)
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  const handleDeleteTeam = async () => {
    try {
      await teamsApi.deleteTeam(teamId)
      message.success('Team deleted')
      queryClient.invalidateQueries({ queryKey: ['myTeams'] })
      navigate('/teams')
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  // Dropdown menu items can't be wrapped in a Popconfirm directly, so the
  // mobile delete path uses Modal.confirm with the same copy/danger styling
  // as the desktop Popconfirm above.
  const confirmDeleteTeam = () => {
    Modal.confirm({
      title: 'Delete Team',
      content: 'Are you sure? This cannot be undone.',
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: { danger: true },
      onOk: handleDeleteTeam,
    })
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksApi.deleteTask(taskId)
      message.success('Task deleted')
      queryClient.invalidateQueries({ queryKey: ['teamTasks', teamId] })
      queryClient.invalidateQueries({ queryKey: ['myTasks'] })
      queryClient.invalidateQueries({ queryKey: ['teamProgress', teamId] })
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      await tasksApi.updateTaskStatus(taskId, status)
      message.success('Status updated')
      queryClient.invalidateQueries({ queryKey: ['teamTasks', teamId] })
      queryClient.invalidateQueries({ queryKey: ['myTasks'] })
      queryClient.invalidateQueries({ queryKey: ['teamProgress', teamId] })
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  const handleViewTask = (task) => {
    setViewingTask(task)
    setIsDetailOpen(true)
  }

  if (teamLoading || tasksLoading) {
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

  if (!team) {
    return (
      <AppLayout>
        <Empty description="Team not found" />
      </AppLayout>
    )
  }

  const addMemberFormContent = (
    <Form layout="vertical" onFinish={handleMemberSubmit(handleAddMember)}>
      <Form.Item
        label="Email"
        validateStatus={memberErrors.email ? 'error' : ''}
        help={memberErrors.email?.message}
        required
      >
        <Controller
          name="email"
          control={memberControl}
          render={({ field }) => (
            <Input {...field} placeholder="member@example.com" />
          )}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={memberSubmitting}
          block
        >
          Add Member
        </Button>
      </Form.Item>
    </Form>
  )

  const editTeamFormContent = (
    <Form layout="vertical" onFinish={handleEditSubmit(handleEditTeam)}>
      <Form.Item
        label="Team Name"
        validateStatus={editErrors.name ? 'error' : ''}
        help={editErrors.name?.message}
        required
      >
        <Controller
          name="name"
          control={editControl}
          render={({ field }) => (
            <Input {...field} placeholder="Team name" />
          )}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={editSubmitting}
          block
        >
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  )

  const MembersSection = () => (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Members
        </Title>
        {isCreator && (
          <Button
            icon={<UserAddOutlined />}
            onClick={() => setIsAddMemberOpen(true)}
            size="small"
          >
            Add Member
          </Button>
        )}
      </div>
      {(team.members || []).length === 0 ? (
        <Empty description="No members yet" />
      ) : (
        <List
          dataSource={team.members || []}
          renderItem={(member) => (
            <List.Item
              actions={
                isCreator && member.id !== team.created_by
                  ? [
                      <Popconfirm
                        key="remove"
                        title="Remove Member"
                        description="Are you sure? This cannot be undone."
                        onConfirm={() => handleRemoveMember(member.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          size="small"
                          danger
                          type="text"
                        />
                      </Popconfirm>,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: '#1677ff' }}>
                    {member.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={
                  <Space>
                    <Text>
                      {member.id === user?.id ? 'You' : member.name}
                    </Text>
                    {member.id === team.created_by && (
                      <Tag color="blue">Admin</Tag>
                    )}
                  </Space>
                }
                description={member.email}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  )

  const TasksSection = () => (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Team Tasks
        </Title>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setIsAddTaskOpen(true)}
          size="small"
          type="primary"
        >
          Add Task
        </Button>
      </div>
      {teamTasks.length === 0 ? (
        <Empty description="No tasks in this team yet" />
      ) : isMobile ? (
        teamTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => setIsAddTaskOpen(true)}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onView={handleViewTask}
          />
        ))
      ) : (
        <TaskTable
          tasks={teamTasks}
          onEdit={() => setIsAddTaskOpen(true)}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onView={handleViewTask}
        />
      )}
    </div>
  )

  const ProgressSection = () => {
    if (progressLoading) {
      return (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <Spin />
        </div>
      )
    }

    if (!progress) {
      return <Empty description="Progress data unavailable" />
    }

    return (
      <div>
        <Title level={4} style={{ marginBottom: 24 }}>
          Team Progress
        </Title>

        {progress.overdue_count > 0 && (
          <Alert
            icon={<WarningOutlined />}
            message={`${progress.overdue_count} overdue task${progress.overdue_count !== 1 ? 's' : ''} require attention`}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={Math.round(progress.completion_percentage)}
              strokeColor="#52c41a"
              format={(pct) => (
                <span>
                  <Text strong style={{ fontSize: 22 }}>
                    {pct}%
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Complete
                  </Text>
                </span>
              )}
              size={140}
            />
          </Col>
          <Col xs={24} sm={16}>
            <Row gutter={[12, 12]}>
              <Col xs={12} sm={12}>
                <Card
                  size="small"
                  style={{ borderRadius: 8, textAlign: 'center' }}
                >
                  <Statistic
                    title="Total"
                    value={progress.total_tasks}
                    valueStyle={{ color: '#1677ff' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={12}>
                <Card
                  size="small"
                  style={{ borderRadius: 8, textAlign: 'center' }}
                >
                  <Statistic
                    title="New"
                    value={progress.status_counts?.new ?? 0}
                    valueStyle={{ color: '#8c8c8c' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={12}>
                <Card
                  size="small"
                  style={{ borderRadius: 8, textAlign: 'center' }}
                >
                  <Statistic
                    title="In Progress"
                    value={progress.status_counts?.['in-progress'] ?? 0}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={12}>
                <Card
                  size="small"
                  style={{ borderRadius: 8, textAlign: 'center' }}
                >
                  <Statistic
                    title="Completed"
                    value={progress.status_counts?.completed ?? 0}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Progress
          percent={Math.round(progress.completion_percentage)}
          strokeColor={{
            '0%': '#fa8c16',
            '100%': '#52c41a',
          }}
          showInfo={false}
          strokeWidth={10}
          style={{ marginBottom: 8 }}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          {progress.status_counts?.completed ?? 0} of {progress.total_tasks}{' '}
          tasks completed
        </Text>
      </div>
    )
  }

  return (
    <AppLayout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          {team.name}
        </Title>
        {isCreator && !isMobile && (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                resetEdit({ name: team.name })
                setIsEditTeamOpen(true)
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete Team"
              description="Are you sure? This cannot be undone."
              onConfirm={handleDeleteTeam}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        )}
        {isCreator && isMobile && (
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit Team',
                  icon: <EditOutlined />,
                  onClick: () => {
                    resetEdit({ name: team.name })
                    setIsEditTeamOpen(true)
                  },
                },
                {
                  key: 'delete',
                  label: 'Delete Team',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: confirmDeleteTeam,
                },
              ],
            }}
          >
            <Button
              icon={<MoreOutlined />}
              type="text"
              style={{ width: 40, height: 40 }}
            />
          </Dropdown>
        )}
      </div>

      {isMobile ? (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'members',
              label: 'Members',
              children: <MembersSection />,
            },
            {
              key: 'tasks',
              label: 'Tasks',
              children: <TasksSection />,
            },
            {
              key: 'progress',
              label: 'Progress',
              children: <ProgressSection />,
            },
          ]}
        />
      ) : (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} md={10}>
              <MembersSection />
            </Col>
            <Col xs={24} md={14}>
              <TasksSection />
            </Col>
          </Row>
          <Card
            style={{ borderRadius: 12 }}
            styles={{ body: { padding: 24 } }}
          >
            <ProgressSection />
          </Card>
        </>
      )}

      {isMobile ? (
        <Drawer
          title="Add Member"
          placement="bottom"
          open={isAddMemberOpen}
          onClose={() => {
            resetMember()
            setIsAddMemberOpen(false)
          }}
          height="auto"
          styles={{ body: { paddingBottom: 24 } }}
        >
          {addMemberFormContent}
        </Drawer>
      ) : (
        <Modal
          title="Add Member"
          open={isAddMemberOpen}
          onCancel={() => {
            resetMember()
            setIsAddMemberOpen(false)
          }}
          footer={null}
          destroyOnClose
        >
          {addMemberFormContent}
        </Modal>
      )}

      {isMobile ? (
        <Drawer
          title="Edit Team"
          placement="bottom"
          open={isEditTeamOpen}
          onClose={() => {
            resetEdit()
            setIsEditTeamOpen(false)
          }}
          height="auto"
          styles={{ body: { paddingBottom: 24 } }}
        >
          {editTeamFormContent}
        </Drawer>
      ) : (
        <Modal
          title="Edit Team"
          open={isEditTeamOpen}
          onCancel={() => {
            resetEdit()
            setIsEditTeamOpen(false)
          }}
          footer={null}
          destroyOnClose
        >
          {editTeamFormContent}
        </Modal>
      )}

      <TaskForm
        open={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        editingTask={null}
        teamId={teamId}
      />

      <TaskDetail
        open={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setViewingTask(null)
        }}
        task={viewingTask}
        onEdit={() => setIsAddTaskOpen(true)}
        onDelete={handleDeleteTask}
      />
    </AppLayout>
  )
}