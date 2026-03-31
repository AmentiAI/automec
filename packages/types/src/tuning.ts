export type TuneRequestStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'waiting_datalog'
  | 'revision'
  | 'completed'
  | 'cancelled'

export type TunePlatform = 'hp_tuners' | 'ecutek' | 'cobb' | 'haltech' | 'link' | 'vi_pec' | 'other'

export interface TunePlatformInfo {
  id: string
  name: string
  slug: string
  logoUrl: string | null
}

export interface TuneRequest {
  id: string
  garageVehicleId: string
  shopId: string | null
  tunerId: string | null
  platform: TunePlatform
  status: TuneRequestStatus
  description: string | null
  powerGoalHp: number | null
  budget: number | null
  createdAt: Date
  updatedAt: Date
}

export interface TuneRequestMessage {
  id: string
  tuneRequestId: string
  senderId: string
  content: string
  fileUrls: string[]
  createdAt: Date
}

export interface TuneFile {
  id: string
  tuneRequestId: string
  uploadedById: string
  fileName: string
  fileUrl: string
  version: number
  notes: string | null
  createdAt: Date
}

export interface TuneLicenseInventory {
  id: string
  shopId: string
  platform: TunePlatform
  licenseKey: string
  isAssigned: boolean
  assignedToRequestId: string | null
  assignedAt: Date | null
}
