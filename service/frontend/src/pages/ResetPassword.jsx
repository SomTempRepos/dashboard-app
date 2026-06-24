import { Card, Typography, Input, Button, Form, App } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as authApi from '../api/authApi'

const { Title, Text } = Typography

const resetSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    new_password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default function ResetPassword() {
  const navigate = useNavigate()
  const { message } = App.useApp()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '', new_password: '', confirmPassword: '' },
  })

  const onSubmit = async (data) => {
    try {
      await authApi.resetPassword({
        email: data.email,
        new_password: data.new_password,
      })
      message.success('Password reset successfully')
      navigate('/login')
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
          <Title level={2} style={{ margin: 0 }}>
            Reset Password
          </Title>
          <Text type="secondary">Enter your email and new password</Text>
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
            label="New Password"
            validateStatus={errors.new_password ? 'error' : ''}
            help={errors.new_password?.message}
          >
            <Controller
              name="new_password"
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

          <Form.Item
            label="Confirm Password"
            validateStatus={errors.confirmPassword ? 'error' : ''}
            help={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
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
              Reset Password
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login">Back to Login</Link>
        </div>
      </Card>
    </div>
  )
}