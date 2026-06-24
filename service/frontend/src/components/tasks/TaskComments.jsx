import { useState } from 'react'
import {
  List,
  Avatar,
  Button,
  Input,
  Typography,
  Popconfirm,
  App,
  Spin,
  Empty,
  Space,
} from 'antd'
import { DeleteOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import * as tasksApi from '../../api/tasksApi'
import * as teamsApi from '../../api/teamsApi'
import * as usersApi from '../../api/usersApi'
import useAuthStore from '../../store/useAuthStore'

const { Text, Title } = Typography
const { TextArea } = Input

export default function TaskComments({ taskId, task }) {
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => tasksApi.getComments(taskId),
    enabled: !!taskId,
  })

  const { data: myTeams = [] } = useQuery({
    queryKey: ['myTeams'],
    queryFn: teamsApi.getMyTeams,
  })

  const commentAuthorIds = [
    ...new Set(comments.map((c) => c.user_id)),
  ].sort()

  const { data: authorInfo = [] } = useQuery({
    queryKey: ['usersBatch', commentAuthorIds],
    queryFn: () => usersApi.batchLookup(commentAuthorIds),
    enabled: commentAuthorIds.length > 0,
  })

  const authorLookup = new Map(authorInfo.map((u) => [u.id, u]))

  // Matches the backend rule in comment_service.py: creator, any assignee,
  // or (if the task is team-scoped) any member of that team can comment.
  const isTeamMember =
    !!task.team_id && myTeams.some((t) => t.id === task.team_id)

  const canComment =
    !!user &&
    (task.created_by === user.id ||
      (task.assigned_to || []).includes(user.id) ||
      isTeamMember)

  const resolveUserId = (userId) => {
    if (userId === user?.id) return 'You'
    const resolved = authorLookup.get(userId)
    if (resolved) return resolved.name
    return userId.slice(0, 8) + '...'
  }

  const handleSubmit = async () => {
    if (!commentText.trim()) return
    setSubmitting(true)
    try {
      await tasksApi.createComment(taskId, commentText.trim())
      setCommentText('')
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] })
      message.success('Comment added')
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await tasksApi.deleteComment(taskId, commentId)
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] })
      message.success('Comment deleted')
    } catch (err) {
      const detail = err?.response?.data?.detail
      message.error(detail || 'Something went wrong')
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <Spin size="small" />
      </div>
    )
  }

  return (
    <div>
      <Title level={5} style={{ marginBottom: 12 }}>
        Comments ({comments.length})
      </Title>

      {comments.length === 0 ? (
        <Empty
          description="No comments yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginBottom: 16 }}
        />
      ) : (
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item
              key={comment.id}
              style={{ padding: '8px 0', alignItems: 'flex-start' }}
              actions={
                comment.user_id === user?.id
                  ? [
                      <Popconfirm
                        key="delete"
                        title="Delete Comment"
                        description="Are you sure? This cannot be undone."
                        onConfirm={() => handleDelete(comment.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          type="text"
                          size="small"
                          danger
                        />
                      </Popconfirm>,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor:
                        comment.user_id === user?.id ? '#1677ff' : '#52c41a',
                    }}
                    size="small"
                  />
                }
                title={
                  <Space size={6}>
                    <Text strong style={{ fontSize: 13 }}>
                      {resolveUserId(comment.user_id)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {dayjs(comment.created_at).format('DD MMM YYYY HH:mm')}
                    </Text>
                  </Space>
                }
                description={
                  <Text style={{ fontSize: 13 }}>{comment.content}</Text>
                }
              />
            </List.Item>
          )}
        />
      )}

      {canComment ? (
        <div style={{ marginTop: 12 }}>
          <TextArea
            rows={2}
            placeholder="Write a comment... (Shift+Enter for new line, Enter to submit)"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            style={{ marginBottom: 8 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={submitting}
            onClick={handleSubmit}
            disabled={!commentText.trim()}
            size="small"
          >
            Post Comment
          </Button>
        </div>
      ) : (
        <Text type="secondary" style={{ fontSize: 12 }}>
          You do not have permission to comment on this task.
        </Text>
      )}
    </div>
  )
}