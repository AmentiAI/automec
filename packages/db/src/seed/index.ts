import { config } from 'dotenv'
import path from 'path'
config({ path: path.resolve(process.cwd(), '../../.env') })

import { db } from '../client.js'
import {
  makes, models, generations, trims, engines, transmissions, vehicleConfigs,
  brands, partCategories, tunePlatforms,
} from '../schema/index.js'

async function seed() {
  console.log('Seeding database...')

  // Tune platforms
  await db.insert(tunePlatforms).values([
    { name: 'HP Tuners', slug: 'hp_tuners' },
    { name: 'EcuTek', slug: 'ecutek' },
    { name: 'Cobb Accessport', slug: 'cobb' },
    { name: 'Haltech', slug: 'haltech' },
    { name: 'Link ECU', slug: 'link' },
    { name: 'Vi-PEC', slug: 'vi_pec' },
  ]).onConflictDoNothing()

  // Makes
  const [subaru, toyota, honda, bmw, ford, nissan] = await db.insert(makes).values([
    { name: 'Subaru', slug: 'subaru' },
    { name: 'Toyota', slug: 'toyota' },
    { name: 'Honda', slug: 'honda' },
    { name: 'BMW', slug: 'bmw' },
    { name: 'Ford', slug: 'ford' },
    { name: 'Nissan', slug: 'nissan' },
  ]).onConflictDoNothing().returning()

  if (!subaru) {
    console.log('Seed data already exists, skipping.')
    return
  }

  // Models
  const [wrx, brz, gr86, civic, m3, mustang, gtr] = await db.insert(models).values([
    { makeId: subaru.id, name: 'WRX', slug: 'wrx' },
    { makeId: subaru.id, name: 'BRZ', slug: 'brz' },
    { makeId: toyota.id, name: 'GR86', slug: 'gr86' },
    { makeId: honda.id, name: 'Civic Type R', slug: 'civic-type-r' },
    { makeId: bmw.id, name: 'M3', slug: 'm3' },
    { makeId: ford.id, name: 'Mustang', slug: 'mustang' },
    { makeId: nissan.id, name: 'GT-R', slug: 'gt-r' },
  ]).returning()

  // Generations
  const [wrxGen5, brzGen2, gr86Gen1] = await db.insert(generations).values([
    { modelId: wrx!.id, name: 'VA (5th Gen)', yearStart: 2015, yearEnd: 2021, bodyStyle: 'sedan' },
    { modelId: wrx!.id, name: 'VB (6th Gen)', yearStart: 2022, yearEnd: null, bodyStyle: 'sedan' },
    { modelId: brz!.id, name: 'ZD8 (2nd Gen)', yearStart: 2022, yearEnd: null, bodyStyle: 'coupe' },
    { modelId: gr86!.id, name: 'ZN8 (1st Gen)', yearStart: 2022, yearEnd: null, bodyStyle: 'coupe' },
  ]).returning()

  // Engines
  const [fa20, fa24, ej257] = await db.insert(engines).values([
    { name: 'FA20', displacement: '2.0L', cylinders: 4, fuelType: 'gasoline', aspiration: 'na', powerHp: 205 },
    { name: 'FA24', displacement: '2.4L', cylinders: 4, fuelType: 'gasoline', aspiration: 'na', powerHp: 228 },
    { name: 'EJ257', displacement: '2.5L', cylinders: 4, fuelType: 'gasoline', aspiration: 'turbo', powerHp: 268 },
    { name: 'FA24DIT', displacement: '2.4L', cylinders: 4, fuelType: 'gasoline', aspiration: 'turbo', powerHp: 271 },
  ]).returning()

  // Transmissions
  const [mt6, cvt, at8] = await db.insert(transmissions).values([
    { name: '6-Speed Manual', type: 'manual', speeds: 6 },
    { name: 'Lineartronic CVT', type: 'cvt', speeds: null },
    { name: '8-Speed Automatic', type: 'automatic', speeds: 8 },
  ]).returning()

  // Vehicle Configs (WRX VA examples)
  if (wrxGen5 && ej257 && mt6 && cvt) {
    await db.insert(vehicleConfigs).values([
      { generationId: wrxGen5.id, engineId: ej257.id, transmissionId: mt6.id, drivetrain: 'awd', yearStart: 2015, yearEnd: 2021 },
      { generationId: wrxGen5.id, engineId: ej257.id, transmissionId: cvt.id, drivetrain: 'awd', yearStart: 2017, yearEnd: 2021 },
    ]).onConflictDoNothing()
  }

  // Brands
  await db.insert(brands).values([
    { name: 'Cobb Tuning', slug: 'cobb-tuning' },
    { name: 'Perrin Performance', slug: 'perrin' },
    { name: 'GrimmSpeed', slug: 'grimmspeed' },
    { name: 'Invidia', slug: 'invidia' },
    { name: 'Process West', slug: 'process-west' },
    { name: 'Nameless Performance', slug: 'nameless-performance' },
    { name: 'Tomei', slug: 'tomei' },
    { name: 'Mishimoto', slug: 'mishimoto' },
  ]).onConflictDoNothing()

  // Part Categories
  await db.insert(partCategories).values([
    { name: 'Air Intake', slug: 'air-intake' },
    { name: 'Exhaust', slug: 'exhaust' },
    { name: 'Suspension', slug: 'suspension' },
    { name: 'Engine Management', slug: 'engine-management' },
    { name: 'Intercooler', slug: 'intercooler' },
    { name: 'Turbo', slug: 'turbo' },
    { name: 'Brakes', slug: 'brakes' },
    { name: 'Drivetrain', slug: 'drivetrain' },
    { name: 'Cooling', slug: 'cooling' },
    { name: 'Accessories', slug: 'accessories' },
  ]).onConflictDoNothing()

  console.log('Seed complete.')
}

seed().catch(console.error)
