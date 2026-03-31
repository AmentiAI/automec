export interface Garage {
  id: string
  userId: string
  name: string
  isPublic: boolean
  slug: string | null
  createdAt: Date
}

export interface GarageVehicle {
  id: string
  garageId: string
  vehicleConfigId: string
  nickname: string | null
  year: number
  makeId: string
  makeName: string
  modelId: string
  modelName: string
  color: string | null
  mileage: number | null
  powerGoalHp: number | null
  notes: string | null
  isPublic: boolean
  createdAt: Date
}

export interface InstalledPart {
  id: string
  garageVehicleId: string
  partId: string
  variantId: string | null
  installedAt: Date | null
  notes: string | null
  priceAtInstall: number | null
}

export interface MaintenanceLog {
  id: string
  garageVehicleId: string
  title: string
  description: string | null
  mileage: number | null
  performedAt: Date
  cost: number | null
}

export interface DynoRun {
  id: string
  garageVehicleId: string
  dynoType: 'hub' | 'roller' | 'engine'
  peakHp: number | null
  peakTq: number | null
  fileUrl: string | null
  notes: string | null
  performedAt: Date
}

export interface GarageVehicleWithParts extends GarageVehicle {
  installedParts: InstalledPart[]
  dynoRuns: DynoRun[]
}
