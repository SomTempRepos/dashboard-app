import { useEffect, useMemo } from 'react'
import {
  Modal,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  App,
  Grid,
  Typography,
} from 'antd'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import * as tasksApi from '../../api/tasksApi'
import * as teamsApi from '../../api/teamsApi'
import useAuthStore from '../../store/useAuthStore'

const { useBreakpoint } = Grid
const { Text } = Typography

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  assigned_to: z
    .array(z.string().email('Each assignee must be a valid email address'))
    .default([]),
  domain: z.string().optional(),
  team_code: z.string().nullable().optional(),
  due_date: z.any().optional().nullable(),
})

export default function TaskForm({ open, onClose, editingTask, teamId }) {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const { data: teams = [] } = useQuery({
    queryKey: ['myTeams'],
    queryFn: teamsApi.getMyTeams,
  })

  const defaultTeamCode = useMemo(() => {
    if (!teamId || !teams.length) return null
    const team = teams.find((t) => t.id === teamId)
    return team ? team.team_code : null
  }, [teamId, teams])

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      assigned_to: user?.email ? [user.email] : [],
      domain: '',
      team_code: null,
      due_date: null,
    },
  })

  const selectedTeamCode = useWatch({ control, name: 'team_code' })

  const selectedTeam = useMemo(
    () => teams.find((t) => t.team_code === selectedTeamCode) || null,
    [teams, selectedTeamCode]
  )

  const memberOptions = useMemo(() => {
    if (!selectedTeam) return []
    return selectedTeam.members.map((m) => ({
      value: m.email,
      label: m.id === user?.id ? `${m.name} (You)` : m.name,
    }))
  }, [selectedTeam, user])

  useEffect(() => {
    if (!open) return
    if (editingTask) {
      const team = editingTask.team_id
        ? teams.find((t) => t.id === editingTask.team_id)
        : null
      const preAssigned =
        editingTask.assigned_to.includes(user?.id) && user?.email
          ? [user.email]
          : []
      reset({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'medium',
        assigned_to: preAssigned,
        domain: editingTask.domain || '',
        team_code: team ? team.team_code : null,
        due_date: editingTask.due_date ? dayjs(editingTask.due_date) : null,
      })
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: user?.email ? [user.email] : [],
        domain: '',
        team_code: defaultTeamCode,
        due_date: null,
      })
    }
  }, [open, editingTask, reset, user, defaultTeamCode, teams])

  const handleTeamChange = (value) => {
    setValue('team_code', value)
    // Selected team changed: clear assignees that aren't valid emails for
    // the newly selected team's roster, since the dropdown options change.
    const newTeam = teams.find((t) => t.team_code === value)
    if (newTeam) {
      const validEmails = new Set(newTeam.members.map((m) => m.email))
      const current = getValues('assigned_to') || []
      setValue(
        'assigned_to',
        current.filter((email) => validEmails.has(email))
      )
    }
  }

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || '',
        priority: data.priority,
        assigned_to: data.assigned_to,
        due_date: data.due_date
          ? dayjs(data.due_date).format('YYYY-MM-DD')
          : null,
      }

      if (data.domain) payload.domain = data.domain

      if (editingTask) {
        payload.team_code =
          data.team_code !== undefined ? data.team_code : undefined
        await tasksApi.updateTask(editingTask.id, payload)
        message.success('Task updated')
      } else {
        payload.status = 'new'
        if (data.team_code) payload.team_code = data.team_code
        await tasksApi.createTask(payload)
        message.success('Task created')
      }

      queryClient.invalidateQueries({ queryKey: ['myTasks'] })

      if (teamId) {
        queryClient.invalidateQueries({ queryKey: ['teamTasks', teamId] })
      }

      const matchedTeam = teams.find((t) => t.team_code === data.team_code)
      if (matchedTeam) {
        queryClient.invalidateQueries({
          queryKey: ['teamTasks', matchedTeam.id],
        })
      }
      if (editingTask?.team_id) {
        queryClient.invalidateQueries({
          queryKey: ['teamTasks', editingTask.team_id],
        })
      }

      onClose()
    } catch (err) {
      const detail = err?.response?.data?.detail || ''
      if (
        detail.toLowerCase().includes('assigned user') ||
        detail.toLowerCase().includes('email')
      ) {
        setError('assigned_to', { message: detail })
      } else if (
        detail.toLowerCase().includes('team with that code') ||
        detail.toLowerCase().includes('not a member')
      ) {
        setError('team_code', { message: detail })
      } else {
        message.error(detail || 'Something went wrong')
      }
    }
  }

  const formContent = (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Title"
        validateStatus={errors.title ? 'error' : ''}
        help={errors.title?.message}
        required
      >
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Task title" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Description"
        validateStatus={errors.description ? 'error' : ''}
        help={errors.description?.message}
      >
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              rows={3}
              placeholder="Task description (optional)"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Priority"
        validateStatus={errors.priority ? 'error' : ''}
        help={errors.priority?.message}
      >
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Domain"
        validateStatus={errors.domain ? 'error' : ''}
        help={errors.domain?.message}
      >
        <Controller
          name="domain"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="e.g. backend, frontend, design (optional)"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Team"
        validateStatus={errors.team_code ? 'error' : ''}
        help={errors.team_code?.message}
      >
        <Controller
          name="team_code"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              allowClear
              disabled={!!teamId}
              placeholder="Select team (optional)"
              options={teams.map((t) => ({
                value: t.team_code,
                label: t.name,
              }))}
              onChange={handleTeamChange}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Assigned To"
        validateStatus={errors.assigned_to ? 'error' : ''}
        help={
          errors.assigned_to?.message ||
          (Array.isArray(errors.assigned_to)
            ? errors.assigned_to.find((e) => e?.message)?.message
            : undefined) ||
          (selectedTeam
            ? 'Select members from the team'
            : 'Type an email address then press Enter or comma to add')
        }
      >
        <Controller
          name="assigned_to"
          control={control}
          render={({ field }) =>
            selectedTeam ? (
              <Select
                {...field}
                mode="multiple"
                placeholder="Select team members"
                options={memberOptions}
                style={{ width: '100%' }}
              />
            ) : (
              <Select
                {...field}
                mode="tags"
                tokenSeparators={[',']}
                placeholder="user@example.com"
                notFoundContent={null}
                style={{ width: '100%' }}
              />
            )
          }
        />
      </Form.Item>

      {!selectedTeam && (
        <Text
          type="secondary"
          style={{ display: 'block', fontSize: 12, marginTop: -16, marginBottom: 16 }}
        >
          Select a team above to assign by name instead of typing emails.
        </Text>
      )}

      <Form.Item
        label="Due Date"
        validateStatus={errors.due_date ? 'error' : ''}
        help={errors.due_date?.message}
      >
        <Controller
          name="due_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              style={{ width: '100%' }}
              placeholder="Select due date (optional)"
            />
          )}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          block
        >
          {editingTask ? 'Update Task' : 'Create Task'}
        </Button>
      </Form.Item>
    </Form>
  )

  if (isMobile) {
    return (
      <Drawer
        title={editingTask ? 'Edit Task' : 'Add Task'}
        placement="bottom"
        open={open}
        onClose={onClose}
        height="auto"
        styles={{
          body: {
            paddingBottom: 24,
            maxHeight: '80vh',
            overflowY: 'auto',
          },
        }}
      >
        {formContent}
      </Drawer>
    )
  }

  return (
    <Modal
      title={editingTask ? 'Edit Task' : 'Add Task'}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {formContent}
    </Modal>
  )
}
