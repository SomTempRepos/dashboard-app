import { Typography, Button, Grid } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Title } = Typography
const { useBreakpoint } = Grid

export default function PageHeader({ title, buttonText, onButtonClick, extra }) {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}
    >
      <Title level={3} style={{ margin: 0 }}>
        {title}
      </Title>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {extra}
        {buttonText && onButtonClick && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onButtonClick}
            size={isMobile ? 'middle' : 'middle'}
          >
            {isMobile ? null : buttonText}
          </Button>
        )}
      </div>
    </div>
  )
}