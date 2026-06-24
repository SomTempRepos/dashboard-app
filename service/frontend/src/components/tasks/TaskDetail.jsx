import {
  Modal,
  Drawer,
  Badge,
  Tag,
  Typography,
  Space,
  Divider,
  Button,
  Grid,
  Avatar,
  Popconfirm,
  Descriptions,
} from 'antd'
import {
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import TaskComments from './TaskComments'
import {
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  formatDate,
  formatDateTime,
} from '../../utils/helpers'
import * as teamsApi from '../../api/teamsApi'
import * as usersApi from '../../api/usersApi'
import useAuthStore from '../../store/useAuthStore'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

export default function TaskDetail({ open, onClose, task, onEdit, onDelete }) {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const user = useAuthStore((state) => state.user)

  const { data: teams = [] } = useQuery({
    queryKey: ['myTeams'],
    queryFn: teamsApi.getMyTeams,
  })

  const assigneeIds = [...(task?.assigned_to || [])].sort()

  const { data: assigneeInfo = [] } = useQuery({
    queryKey: ['usersBatch', assigneeIds],
    queryFn: () => usersApi.batchLookup(assigneeIds),
    enabled: assigneeIds.length > 0,
  })

  if (!task) return null

  const teamName = task.team_id
    ? teams.find((t) => t.id === task.team_id)?.name || task.team_id
    : 'No team'

  const userLookup = new Map(assigneeInfo.map((u) => [u.id, u]))

  const resolveAssignee = (userId) => {
    if (userId === user?.id) {
      return { name: 'You', initial: (user?.name || 'Y').charAt(0) }
    }
    const resolved = userLookup.get(userId)
    if (resolved) {
      return { name: resolved.name, initial: resolved.name.charAt(0) }
    }
    return { name: userId.slice(0, 8) + '...', initial: '?' }
  }

  const content = (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <Title level={4} style={{ margin: 0, flex: 1 }}>
          {task.title}
        </Title>
        {task.is_overdue && (
          <Tag color="red" icon={<WarningOutlined />}>
            Overdue
          </Tag>
        )}
      </div>

      <Space wrap style={{ marginBottom: 16 }}>
        <Badge
          status={getStatusColor(task.status)}
          text={getStatusLabel(task.status)}
        />
        <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
        {task.domain && <Tag color="purple">{task.domain}</Tag>}
      </Space>

      {task.description && (
        <div style={{ marginBottom: 16 }}>
          <Text
            type="secondary"
            style={{
              fontSize: 11,
              display: 'block',
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Description
          </Text>
          <Text>{task.description}</Text>
        </div>
      )}

      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item
          label={
            <Space>
              <CalendarOutlined />
              Due Date
            </Space>
          }
        >
          <Text style={{ color: task.is_overdue ? '#ff4d4f' : undefined }}>
            {formatDate(task.due_date)}
          </Text>
        </Descriptions.Item>

        {task.updated_at && (
          <Descriptions.Item label="Last Updated">
            {formatDateTime(task.updated_at)}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Created">
          {formatDateTime(task.created_at)}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Space>
              <TeamOutlined />
              Team
            </Space>
          }
        >
          {teamName}
        </Descriptions.Item>
      </Descriptions>

      {task.assigned_to && task.assigned_to.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Text
            type="secondary"
            style={{
              fontSize: 11,
              display: 'block',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Assigned To
          </Text>
          <Space wrap>
            {task.assigned_to.map((userId) => {
              const assignee = resolveAssignee(userId)
              return (
                <Space key={userId} size={4}>
                  <Avatar
                    style={{
                      backgroundColor:
                        userId === user?.id ? '#1677ff' : '#52c41a',
                    }}
                    size="small"
                  >
                    {assignee.initial.toUpperCase()}
                  </Avatar>
                  <Text style={{ fontSize: 12 }}>{assignee.name}</Text>
                </Space>
              )
            })}
          </Space>
        </div>
      )}

      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            onClose()
            onEdit(task)
          }}
        >
          Edit
        </Button>
        <Popconfirm
          title="Delete Task"
          description="Are you sure? This cannot be undone."
          onConfirm={() => {
            onDelete(task.id)
            onClose()
          }}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button icon={<DeleteOutlined />} danger size="small">
            Delete
          </Button>
        </Popconfirm>
      </Space>

      <Divider style={{ margin: '12px 0' }} />

      <TaskComments taskId={task.id} task={task} />
    </div>
  )

  if (isMobile) {
    return (
      <Drawer
        title="Task Detail"
        placement="bottom"
        open={open}
        onClose={onClose}
        height="92vh"
        styles={{ body: { overflowY: 'auto', paddingBottom: 32 } }}
      >
        {content}
      </Drawer>
    )
  }

  return (
    <Modal
      title="Task Detail"
      open={open}
      onCancel={onClose}
      footer={null}
      width={660}
      destroyOnClose
      styles={{ body: { maxHeight: '72vh', overflowY: 'auto' } }}
    >
      {content}
    </Modal>
  )
}