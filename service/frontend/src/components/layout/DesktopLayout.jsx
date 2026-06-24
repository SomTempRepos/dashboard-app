import { Layout, Avatar, Button, Typography, Space } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import useAuthStore from '../../store/useAuthStore'
import * as authApi from '../../api/authApi'

const { Header, Content } = Layout
const { Text } = Typography

export default function DesktopLayout({ children }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // proceed with logout regardless
    } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 220 }}>
        <Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Text strong style={{ fontSize: 18, color: '#1677ff' }}>
            WorkBoard
          </Text>
          <Space>
            {user && (
              <Space>
                <Avatar
                  style={{ backgroundColor: '#1677ff', cursor: 'pointer' }}
                  onClick={() => navigate('/profile')}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Text strong>{user.name}</Text>
              </Space>
            )}
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              type="text"
            >
              Logout
            </Button>
          </Space>
        </Header>
        <Content
          style={{
            padding: 24,
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}