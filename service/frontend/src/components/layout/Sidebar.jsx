import { Layout, Menu, Typography } from 'antd'
import {
  HomeOutlined,
  CheckSquareOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Sider } = Layout
const { Title } = Typography

const menuItems = [
  {
    key: '/dashboard',
    icon: <HomeOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/tasks',
    icon: <CheckSquareOutlined />,
    label: 'My Tasks',
  },
  {
    key: '/teams',
    icon: <TeamOutlined />,
    label: 'Teams',
  },
  {
    key: '/profile',
    icon: <UserOutlined />,
    label: 'Profile',
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const getSelectedKey = () => {
    const path = location.pathname
    if (path.startsWith('/teams/') && path !== '/teams') return '/teams'
    return path
  }

  return (
    <Sider
      width={220}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 24,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
          WorkBoard
        </Title>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{ border: 'none', paddingTop: 8 }}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}