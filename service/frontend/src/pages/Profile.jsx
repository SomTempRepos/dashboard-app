import {
  Card,
  Avatar,
  Typography,
  Form,
  Input,
  Button,
  Divider,
  Popconfirm,
  App,
  Space,
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import AppLayout from '../components/layout/AppLayout'
import axiosInstance from '../api/axios'
import * as authApi from '../api/authApi'
import useAuthStore from '../store/useAuthStore'

const { Title, Text } = Typography

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
})

const passwordSchema = z
  .object({
    new_password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default function Profile() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const { logout, setUser } = useAuthStore()

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => axiosInstance.get('/users/me').then((res) => res.data),
  })

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '' },
  })

  const {
    control: passControl,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors, isSubmitting: passSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { new_password: '', confirmPassword: '' },
  })

  useEffect(() => {
    if (me) {
      resetProfile({ name: me.name, email: me.email })
    }
  }, [me, resetProfile])

  const onProfileSubmit = async (data) => {
    try {
      const res = await axiosInstance.put('/users/me', data)
      setUser(res.data)
      message.success('Profile updated')
      queryClient.invalidateQueries({ queryKey: ['me'] })
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
      await authApi.resetPassword({
        email: me.email,
        new_password: data.new_password,
      })
      message.success('Password updated')
      resetPass()
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // proceed regardless
    } finally {
      logout()
      navigate('/login')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete('/users/me')
      logout()
      navigate('/login')
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Card
          style={{ borderRadius: 12, marginBottom: 16 }}
          loading={isLoading}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Avatar
              size={80}
              style={{ backgroundColor: '#1677ff', fontSize: 32, marginBottom: 12 }}
              icon={<UserOutlined />}
            >
              {me?.name ? me.name.charAt(0).toUpperCase() : ''}
            </Avatar>
            <Title level={4} style={{ margin: 0 }}>
              {me?.name}
            </Title>
            <Text type="secondary">{me?.email}</Text>
          </div>

          <Divider>Edit Profile</Divider>

          <Form layout="vertical" onFinish={handleProfileSubmit(onProfileSubmit)}>
            <Form.Item
              label="Name"
              validateStatus={profileErrors.name ? 'error' : ''}
              help={profileErrors.name?.message}
            >
              <Controller
                name="name"
                control={profileControl}
                render={({ field }) => (
                  <Input {...field} placeholder="Your name" />
                )}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              validateStatus={profileErrors.email ? 'error' : ''}
              help={profileErrors.email?.message}
            >
              <Controller
                name="email"
                control={profileControl}
                render={({ field }) => (
                  <Input {...field} placeholder="your@email.com" />
                )}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={profileSubmitting}
                block
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>

          <Divider>Change Password</Divider>

          <Form layout="vertical" onFinish={handlePassSubmit(onPasswordSubmit)}>
            <Form.Item
              label="New Password"
              validateStatus={passErrors.new_password ? 'error' : ''}
              help={passErrors.new_password?.message}
            >
              <Controller
                name="new_password"
                control={passControl}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="••••••••" />
                )}
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              validateStatus={passErrors.confirmPassword ? 'error' : ''}
              help={passErrors.confirmPassword?.message}
            >
              <Controller
                name="confirmPassword"
                control={passControl}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="••••••••" />
                )}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={passSubmitting}
                block
              >
                Update Password
              </Button>
            </Form.Item>
          </Form>

          <Divider>Danger Zone</Divider>

          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            <Button block onClick={handleLogout}>
              Logout
            </Button>
            <Popconfirm
              title="Delete Account"
              description="This action cannot be undone."
              onConfirm={handleDeleteAccount}
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button danger block>
                Delete Account
              </Button>
            </Popconfirm>
          </Space>
        </Card>
      </div>
    </AppLayout>
  )
}