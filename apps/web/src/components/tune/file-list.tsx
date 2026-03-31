'use client'

import { Button, Badge } from '@automec/ui'
import { Download, Upload, FileText } from 'lucide-react'
import { format } from 'date-fns'
import type { tuneFiles, users } from '@automec/db'
import type { InferSelectModel } from 'drizzle-orm'

interface Props {
  requestId: string
  currentUserId: string
  files: Array<{
    file: InferSelectModel<typeof tuneFiles>
    uploader: InferSelectModel<typeof users>
  }>
}

export function TuneFileList({ requestId, currentUserId, files }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Files</h2>
        <Button size="sm" variant="outline">
          <Upload className="mr-1 h-3 w-3" />
          Upload
        </Button>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">No files yet.</p>
      ) : (
        <div className="space-y-2">
          {files.map(({ file, uploader }) => (
            <div key={file.id} className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{file.fileName}</div>
                  <div className="text-xs text-muted-foreground">
                    v{file.version} · {format(file.createdAt, 'MMM d')}
                  </div>
                </div>
              </div>
              <a href={file.fileUrl} download target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
