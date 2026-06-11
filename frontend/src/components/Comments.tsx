import React, { useEffect, useState } from 'react'
import api from '../api/axios'

type Comment = {
  id: number
  user_id: number
  content: string
  is_instruction: boolean
  created_at: string
  name?: string
  email: string
}

type Props = {
  routeId: number
}

export default function Comments({ routeId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const loadComments = () => {
    api.get(`/api/routes/${routeId}/comments`)
      .then((res) => {
        setComments(res.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadComments()
  }, [routeId])

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    try {
      await api.post(`/api/routes/${routeId}/comments`, { content })
      setContent('')
      loadComments()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to post comment')
    }
  }

  if (loading) return <p>Loading comments...</p>

  return (
    <div style={{ marginTop: 20, padding: 10, border: '1px solid #ddd' }}>
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
          {comments.map((c) => (
            <div key={c.id} style={{ marginBottom: 8, padding: 6, background: '#f9f9f9' }}>
              <strong>{c.name || c.email}</strong>: {c.content}
              <br />
              <small style={{ color: '#666' }}>{new Date(c.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={postComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', padding: 6 }}
        />
        <button type="submit" style={{ marginTop: 6 }}>Post Comment</button>
      </form>
    </div>
  )
}
