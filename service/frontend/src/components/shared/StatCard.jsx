import { Card, Typography } from 'antd'

const { Text, Title } = Typography

export default function StatCard({ title, value, icon, color }) {
  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s ease',
        cursor: 'default',
      }}
      styles={{ body: { padding: '20px 24px' } }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: color,
          }}
        >
          {icon}
        </div>
        <div>
          <Title level={2} style={{ margin: 0, color: color, lineHeight: 1 }}>
            {value}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {title}
          </Text>
        </div>
      </div>
    </Card>
  )
}