import {
  Table,
  Tag,
  Badge,
  Avatar,
  Button,
  Popconfirm,
  Space,
  Typography,
  Tooltip,
} from 'antd'
import {
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

const { Text } = Typography

export default function TaskTable({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
}) {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Text type="secondary">{truncateText(text || '', 60)}</Text>
      ),
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      render: (domain) =>
        domain ? (
          <Tag color="purple">{domain}</Tag>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Space>
          <Badge
            status={getStatusColor(record.status)}
            text={getStatusLabel(record.status)}
          />
          {record.is_overdue && (
            <Tooltip title="Overdue">
              <WarningOutlined style={{ color: '#ff4d4f' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date, record) => (
        <Text style={{ color: record.is_overdue ? '#ff4d4f' : undefined }}>
          {formatDate(date)}
        </Text>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assigned_to',
      key: 'assigned_to',
      render: (assignedTo) => (
        <Avatar.Group max={{ count: 3 }}>
          {(assignedTo || []).map((userId) => (
            <Avatar
              key={userId}
              style={{ backgroundColor: '#1677ff' }}
              size="small"
            >
              {userId.charAt(0).toUpperCase()}
            </Avatar>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {onView && (
            <Button
              icon={<EyeOutlined />}
              size="small"
              type="text"
              onClick={() => onView(record)}
            />
          )}
          <Button
            icon={<EditOutlined />}
            size="small"
            type="text"
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete Task"
            description="Are you sure? This cannot be undone."
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              type="text"
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      dataSource={tasks}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10, showSizeChanger: false }}
      scroll={{ x: 900 }}
    />
  )
}