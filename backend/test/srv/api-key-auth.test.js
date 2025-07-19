import { describe, it, beforeEach, afterEach } from 'vitest'
import cds from '@sap/cds'

describe('API Key Authentication Tests', () => {
  const { GET, POST, expect } = cds.test(__dirname + '/../..')
  
  const originalApiKeys = process.env.API_KEYS
  
  beforeEach(() => {
    process.env.API_KEYS = 'test-key-123,test-key-456'
  })
  
  afterEach(() => {
    if (originalApiKeys) {
      process.env.API_KEYS = originalApiKeys
    } else {
      delete process.env.API_KEYS
    }
  })

  describe('Public API Access', () => {
    it('should allow access to public movie search without API key', async () => {
      const { data } = await GET('/api/Movies?s=toy')
      
      const result = data.value[0]
      expect(result).to.have.property('Search')
      expect(result.Search).to.be.an('array')
    })

    it('should allow access to public movie search with invalid API key', async () => {
      const { data } = await GET('/api/Movies?s=toy', {
        headers: { 'x-api-key': 'invalid-key' }
      })
      
      const result = data.value[0]
      expect(result).to.have.property('Search')
      expect(result.Search).to.be.an('array')
    })
  })

  describe('Admin API Access', () => {
    it('should deny access to admin endpoint without API key', async () => {
      try {
        await GET('/admin/Movies')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.response.status).to.equal(401)
      }
    })

    it('should deny access to admin endpoint with invalid API key', async () => {
      try {
        await GET('/admin/Movies', {
          headers: { 'x-api-key': 'invalid-key' }
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.response.status).to.equal(401)
      }
    })

    it('should allow access to admin endpoint with valid API key', async () => {
      const { data } = await GET('/admin/Movies', {
        headers: { 'x-api-key': 'test-key-123' }
      })
      
      expect(data).to.have.property('value')
      expect(data.value).to.be.an('array')
    })

    it('should allow access with second valid API key', async () => {
      const { data } = await GET('/admin/Movies', {
        headers: { 'x-api-key': 'test-key-456' }
      })
      
      expect(data).to.have.property('value')
      expect(data.value).to.be.an('array')
    })
  })

  describe('API Key Format Handling', () => {
    it('should handle API keys with whitespace', async () => {
      process.env.API_KEYS = ' test-key-123 , test-key-456 '
      
      const { data } = await GET('/admin/Movies', {
        headers: { 'x-api-key': 'test-key-123' }
      })
      
      expect(data).to.have.property('value')
    })

    it('should handle empty API_KEYS environment variable', async () => {
      process.env.API_KEYS = ''
      
      try {
        await GET('/admin/Movies', {
          headers: { 'x-api-key': 'any-key' }
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.response.status).to.equal(401)
      }
    })

    it('should handle missing API_KEYS environment variable', async () => {
      delete process.env.API_KEYS
      
      try {
        await GET('/admin/Movies', {
          headers: { 'x-api-key': 'any-key' }
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.response.status).to.equal(401)
      }
    })
  })

  describe('Header Case Sensitivity', () => {
    it('should handle lowercase header name', async () => {
      const { data } = await GET('/admin/Movies', {
        headers: { 'x-api-key': 'test-key-123' }
      })
      
      expect(data).to.have.property('value')
    })

    it('should handle uppercase header name', async () => {
      const { data } = await GET('/admin/Movies', {
        headers: { 'X-API-KEY': 'test-key-123' }
      })
      
      expect(data).to.have.property('value')
    })
  })
})