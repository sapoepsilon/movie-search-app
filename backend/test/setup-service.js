import cds from '@sap/cds'

export async function setupTestService() {
  // Load CDS model
  cds.env.requires.db = { kind: 'sqlite', credentials: { database: ':memory:' } }
  
  // Deploy to in-memory database
  const db = await cds.deploy('./db/schema.cds').to('sqlite::memory:')
  
  // Connect CDS services
  await cds.connect()
  
  return { db }
}

export async function teardownTestService() {
  await cds.shutdown()
}