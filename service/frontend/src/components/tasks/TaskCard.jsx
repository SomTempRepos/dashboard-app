import {
  Card,
  Tag,
  Badge,
  Typography,
  Button,
  Popconfirm,
  Select,
  Space,
} from 'antd'
import {
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import {
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  formatDate,
  truncateText,
} from '../../utils/helpers'

const { Text, Title } = Typography

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
}) {
  return (
    <Card
      style={{
        marginBottom: 12,
        borderRadius: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        borderLeft: task.is_overdue ? '3px solid #ff4d4f' : undefined,
      }}
      styles={{ body: { padding: '14px 16px' } }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 6,
        }}
      >
        <Title level={5} style={{ margin: 0, flex: 1, paddingRight: 8 }}>
          {task.title}
        </Title>
        <Tag color={getPriorityColor(task.priority)} style={{ margin: 0 }}>
          {task.priority}
        </Tag>
      </div>

      <Space wrap style={{ marginBottom: 8 }}>
        <Badge
          status={getStatusColor(task.status)}
          text={getStatusLabel(task.status)}
        />
        {task.is_overdue && (
          <Tag
            color="red"
            icon={<WarningOutlined />}
            style={{ fontSize: 11 }}
          >
            Overdue
          </Tag>
        )}
        {task.domain && (
          <Tag color="purple" style={{ fontSize: 11 }}>
            {task.domain}
          </Tag>
        )}
      </Space>

      {task.description && (
        <Text
          type="secondary"
          style={{ display: 'block', marginBottom: 8, fontSize: 13 }}
        >
          {truncateText(task.description, 80)}
        </Text>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginBottom: 12,
        }}
      >
        <CalendarOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
        <Text type="secondary" style={{ fontSize: 13 }}>
          {formatDate(task.due_date)}
        </Text>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Select
          size="small"
          value={task.status}
          options={statusOptions}
          onChange={(val) => onStatusChange(task.id, val)}
          style={{ width: 140 }}
        />
        <Space>
          {onView && (
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(task)}
              type="text"
            />
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(task)}
            type="text"
          />
          <Popconfirm
            title="Delete Task"
            description="Are you sure? This cannot be undone."
            onConfirm={() => onDelete(task.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              size="small"
              icon={<DeleteOutlined />}
              type="text"
              danger
            />
          </Popconfirm>
        </Space>
      </div>
    </Card>
  )
}