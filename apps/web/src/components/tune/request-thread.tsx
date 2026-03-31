'use client'

import { useState } from 'react'
import { Button, Input } from '@automec/ui'
import { sendTuneMessageAction } from '@/actions/tune'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import type { tuneRequestMessages, users } from '@automec/db'
import type { InferSelectModel } from 'drizzle-orm'
import { Send } from 'lucide-react'

interface Props {
  requestId: string
  currentUserId: string
  messages: Array<{
    message: InferSelectModel<typeof tuneRequestMessages>
    sender: InferSelectModel<typeof users>
  }>
}

export function TuneRequestThread({ requestId, currentUserId, messages }: Props) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const router = useRouter()

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSending(true)
    await sendTuneMessageAction({ tuneRequestId: requestId, content: content.trim(), fileUrls: [] })
    setContent('')
    setSending(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 font-semibold">Messages</h2>
      <div className="mb-4 min-h-[200px] space-y-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet. Start the conversation.</p>
        ) : (
          messages.map(({ message, sender }) => {
            const isMe = sender.id === currentUserId
            return (
              <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-sm rounded-lg px-4 py-2 text-sm ${
                    isMe
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {!isMe && (
                    <div className="mb-1 text-xs font-medium opacity-70">{sender.name ?? sender.email}</div>
                  )}
                  <div>{message.content}</div>
                  <div className="mt-1 text-xs opacity-60">
                    {format(message.createdAt, 'MMM d, h:mm a')}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
        />
        <Button type="submit" size="icon" disabled={sending || !content.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
