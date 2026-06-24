import { Card, Typography, Input, Button, Form, App } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as authApi from '../api/authApi'
import axiosInstance from '../api/axios'
import useAuthStore from '../store/useAuthStore'

const { Title, Text } = Typography

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Login() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { login } = useAuthStore()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data)
      const { access_token } = res.data

      localStorage.setItem('access_token', access_token)

      const userRes = await axiosInstance.get('/users/me')
      login(userRes.data, access_token)

      navigate('/dashboard')
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Card style={{ width: '100%', maxWidth: 400, borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, color: '#1677ff' }}>
            WorkBoard
          </Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="your@email.com" size="large" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="••••••••"
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isSubmitting}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Link to="/reset-password">Forgot Password?</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Text type="secondary">Don't have an account? </Text>
          <Link to="/register">Register</Link>
        </div>
      </Card>
    </div>
  )
}