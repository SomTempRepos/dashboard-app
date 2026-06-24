import { useState } from 'react'
import { Row, Col, Spin, Empty, App } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import PageHeader from '../components/shared/PageHeader'
import TeamCard from '../components/teams/TeamCard'
import TeamForm from '../components/teams/TeamForm'
import * as teamsApi from '../api/teamsApi'
import useAuthStore from '../store/useAuthStore'

export default function Teams() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['myTeams'],
    queryFn: teamsApi.getMyTeams,
  })

  const handleDelete = async (teamId) => {
    try {
      await teamsApi.deleteTeam(teamId)
      message.success('Team deleted')
      queryClient.invalidateQueries({ queryKey: ['myTeams'] })
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageHeader
        title="My Teams"
        buttonText="+ Create Team"
        onButtonClick={() => setIsModalOpen(true)}
      />

      {teams.length === 0 ? (
        <Empty description="No teams yet. Create your first team!" />
      ) : (
        <Row gutter={[16, 16]}>
          {teams.map((team) => (
            <Col key={team.id} xs={24} sm={12} md={8}>
              <TeamCard
                team={team}
                onView={(id) => navigate(`/teams/${id}`)}
                onDelete={handleDelete}
                isCreator={team.created_by === user?.id}
              />
            </Col>
          ))}
        </Row>
      )}

      <TeamForm open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppLayout>
  )
}