import { Row, Col, Button, Spin, Empty, Typography, Grid } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import AppLayout from '../components/layout/AppLayout'
import StatCard from '../components/shared/StatCard'
import TaskTable from '../components/tasks/TaskTable'
import TaskCard from '../components/tasks/TaskCard'
import TeamCard from '../components/teams/TeamCard'
import * as tasksApi from '../api/tasksApi'
import * as teamsApi from '../api/teamsApi'
import useAuthStore from '../store/useAuthStore'
import {
  CheckSquareOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const getGreeting = () => {
  const hour = dayjs().hour()
  if (hour >= 0 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const user = useAuthStore((state) => state.user)

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['myTasks'],
    queryFn: tasksApi.getAllMyTasks,
  })

  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['myTeams'],
    queryFn: teamsApi.getMyTeams,
  })

  const isLoading = tasksLoading || teamsLoading

  const inProgressCount = tasks.filter(
    (t) => t.status === 'in-progress'
  ).length
  const completedCount = tasks.filter(
    (t) => t.status === 'completed'
  ).length

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  if (isLoading) {
    return (
      <AppLayout>
        <div
          style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}
        >
          <Spin size="large" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          {getGreeting()}, {user?.name || 'User'} 👋
        </Title>
        <Text type="secondary">{dayjs().format('DD MMM YYYY')}</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <StatCard
            title="Total Tasks"
            value={tasks.length}
            icon={<CheckSquareOutlined />}
            color="#1677ff"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="In Progress"
            value={inProgressCount}
            icon={<ClockCircleOutlined />}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Completed"
            value={completedCount}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
      </Row>

      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            My Recent Tasks
          </Title>
          <Button type="link" onClick={() => navigate('/tasks')}>
            View All
          </Button>
        </div>

        {recentTasks.length === 0 ? (
          <Empty description="No tasks yet. Add your first task!" />
        ) : isMobile ? (
          recentTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => navigate('/tasks')}
              onDelete={() => {}}
              onStatusChange={() => {}}
            />
          ))
        ) : (
          <TaskTable
            tasks={recentTasks}
            onEdit={() => navigate('/tasks')}
            onDelete={() => {}}
            onStatusChange={() => {}}
          />
        )}
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            My Teams
          </Title>
          <Button type="link" onClick={() => navigate('/teams')}>
            View All
          </Button>
        </div>

        {teams.length === 0 ? (
          <Empty description="No teams yet. Create your first team!" />
        ) : (
          <Row gutter={[16, 16]}>
            {teams.map((team) => (
              <Col key={team.id} xs={24} sm={12} md={8}>
                <TeamCard
                  team={team}
                  onView={(id) => navigate(`/teams/${id}`)}
                  onDelete={() => {}}
                  isCreator={team.created_by === user?.id}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </AppLayout>
  )
}