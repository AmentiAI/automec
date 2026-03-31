export interface Make {
  id: string
  name: string
  slug: string
  logoUrl: string | null
}

export interface Model {
  id: string
  makeId: string
  name: string
  slug: string
}

export interface Generation {
  id: string
  modelId: string
  name: string
  yearStart: number
  yearEnd: number | null
  bodyStyle: string | null
}

export interface Trim {
  id: string
  generationId: string
  name: string
  market: string | null
}

export interface Engine {
  id: string
  name: string
  displacement: string | null
  cylinders: number | null
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'flex'
  aspiration: 'na' | 'turbo' | 'supercharged' | 'twinturbo' | null
  powerHp: number | null
  torqueNm: number | null
}

export interface Transmission {
  id: string
  name: string
  type: 'manual' | 'automatic' | 'dct' | 'cvt'
  speeds: number | null
}

export interface VehicleConfig {
  id: string
  generationId: string
  trimId: string | null
  engineId: string
  transmissionId: string | null
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd'
  yearStart: number
  yearEnd: number | null
}

export interface SelectedVehicle {
  makeId: string
  makeName: string
  modelId: string
  modelName: string
  generationId: string
  year: number
  trimId?: string
  engineId?: string
  transmissionId?: string
  configId?: string
}
