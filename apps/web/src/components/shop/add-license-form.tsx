'use client'

import { useState } from 'react'
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@automec/ui'
import { addLicenseAction } from '@/actions/shop'
import { useRouter } from 'next/navigation'

const platforms = [
  { value: 'hp_tuners', label: 'HP Tuners' },
  { value: 'ecutek', label: 'EcuTek' },
  { value: 'cobb', label: 'Cobb Accessport' },
  { value: 'haltech', label: 'Haltech' },
  { value: 'link', label: 'Link ECU' },
  { value: 'vi_pec', label: 'Vi-PEC' },
  { value: 'other', label: 'Other' },
]

export function AddLicenseForm() {
  const [platform, setPlatform] = useState('')
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!platform || !key) return
    setLoading(true)
    await addLicenseAction(platform, key)
    setKey('')
    setPlatform('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="w-48">
        <Label>Platform</Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Label>License key</Label>
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter license key"
          className="font-mono"
        />
      </div>
      <Button type="submit" disabled={!platform || !key || loading}>
        {loading ? 'Adding...' : 'Add'}
      </Button>
    </form>
  )
}
