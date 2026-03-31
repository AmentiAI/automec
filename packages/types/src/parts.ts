export type PartCondition = 'new' | 'used' | 'remanufactured'

export interface Brand {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  websiteUrl: string | null
}

export interface PartCategory {
  id: string
  name: string
  slug: string
  parentId: string | null
  description: string | null
}

export interface Part {
  id: string
  brandId: string
  categoryId: string
  shopId: string
  name: string
  slug: string
  sku: string | null
  partNumber: string | null
  description: string | null
  price: number | null
  condition: PartCondition
  isActive: boolean
  isTuneRequired: boolean
  createdAt: Date
}

export interface PartVariant {
  id: string
  partId: string
  name: string
  sku: string | null
  price: number | null
  attributes: Record<string, string>
}

export interface PartImage {
  id: string
  partId: string
  url: string
  altText: string | null
  sortOrder: number
  isPrimary: boolean
}

export interface PartWithRelations extends Part {
  brand: Brand
  category: PartCategory
  images: PartImage[]
  variants: PartVariant[]
}
