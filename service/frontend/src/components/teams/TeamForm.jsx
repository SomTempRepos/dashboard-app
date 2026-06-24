import { Modal, Drawer, Form, Input, Button, App, Grid } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import * as teamsApi from '../../api/teamsApi'

const { useBreakpoint } = Grid

const teamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
})

export default function TeamForm({ open, onClose }) {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const { message } = App.useApp()
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: '' },
  })

  const onSubmit = async (data) => {
    try {
      await teamsApi.createTeam(data)
      message.success('Team created')
      queryClient.invalidateQueries({ queryKey: ['myTeams'] })
      reset()
      onClose()
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  const formContent = (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Team Name"
        validateStatus={errors.name ? 'error' : ''}
        help={errors.name?.message}
        required
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Enter team name" />
          )}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          Create Team
        </Button>
      </Form.Item>
    </Form>
  )

  if (isMobile) {
    return (
      <Drawer
        title="Create Team"
        placement="bottom"
        open={open}
        onClose={() => { reset(); onClose() }}
        height="auto"
        styles={{ body: { paddingBottom: 24 } }}
      >
        {formContent}
      </Drawer>
    )
  }

  return (
    <Modal
      title="Create Team"
      open={open}
      onCancel={() => { reset(); onClose() }}
      footer={null}
      destroyOnClose
    >
      {formContent}
    </Modal>
  )
}