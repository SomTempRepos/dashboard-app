import { Card, Typography, Button, Popconfirm, Space, Tag } from 'antd'
import { TeamOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function TeamCard({ team, onView, onDelete, isCreator }) {
  return (
    <Card
      style={{
        borderRadius: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        height: '100%',
      }}
      styles={{ body: { padding: '16px 20px' } }}
    >
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Title level={5} style={{ margin: 0 }}>
          {team.name}
        </Title>
        {isCreator && (
          <Tag color="blue" style={{ margin: 0 }}>
            Creator
          </Tag>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <TeamOutlined style={{ color: '#8c8c8c' }} />
        <Text type="secondary">
          {team.members?.length || 0} member{(team.members?.length || 0) !== 1 ? 's' : ''}
        </Text>
      </div>

      <Space>
        <Button type="primary" size="small" onClick={() => onView(team.id)}>
          View Team
        </Button>
        {isCreator && (
          <Popconfirm
            title="Delete Team"
            description="Are you sure? This cannot be undone."
            onConfirm={() => onDelete(team.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        )}
      </Space>
    </Card>
  )
}