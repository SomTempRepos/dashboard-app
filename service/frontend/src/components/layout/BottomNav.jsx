import { useNavigate, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  CheckSquareOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Typography } from 'antd'

const { Text } = Typography

const navItems = [
  { path: '/dashboard', icon: HomeOutlined, label: 'Home' },
  { path: '/tasks', icon: CheckSquareOutlined, label: 'Tasks' },
  { path: '/teams', icon: TeamOutlined, label: 'Teams' },
  { path: '/profile', icon: UserOutlined, label: 'Profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const getIsActive = (path) => {
    if (path === '/teams') {
      return location.pathname === '/teams' || location.pathname.startsWith('/teams/')
    }
    return location.pathname === path
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = getIsActive(path)
        return (
          <div
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              cursor: 'pointer',
              minHeight: 48,
              color: active ? '#1677ff' : '#8c8c8c',
            }}
          >
            <Icon style={{ fontSize: 20 }} />
            <Text
              style={{
                fontSize: 11,
                color: active ? '#1677ff' : '#8c8c8c',
                lineHeight: 1,
              }}
            >
              {label}
            </Text>
          </div>
        )
      })}
    </div>
  )
}