import { Layout, Avatar, Typography } from 'antd'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header } = Layout
const { Text } = Typography

const mainRoutes = ['/dashboard', '/tasks', '/teams', '/profile']

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'My Tasks',
  '/teams': 'Teams',
  '/profile': 'Profile',
}

const getPageTitle = (pathname) => {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname.startsWith('/teams/')) return 'Team Details'
  return 'WorkBoard'
}

export default function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const isMainRoute = mainRoutes.includes(pathname)

  return (
    <Header
      style={{
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 16px',
        height: 56,
        lineHeight: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      <div style={{ width: 40, display: 'flex', alignItems: 'center' }}>
        {!isMainRoute && (
          <ArrowLeftOutlined
            style={{ fontSize: 18, cursor: 'pointer', padding: 8 }}
            onClick={() => navigate(-1)}
          />
        )}
      </div>
      <Text strong style={{ fontSize: 16 }}>
        {getPageTitle(pathname)}
      </Text>
      <Avatar
        style={{ backgroundColor: '#1677ff', cursor: 'pointer' }}
        icon={<UserOutlined />}
        onClick={() => navigate('/profile')}
        size={36}
      />
    </Header>
  )
}