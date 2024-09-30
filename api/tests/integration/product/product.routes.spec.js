const request = require('supertest')
const app = require('../../../src/index')
const { Framework } = require('@vechain/connex-framework')
const { Driver, SimpleNet } = require('@vechain/connex-driver')
const testData = require('./product.routes.data')

jest.mock('@vechain/connex-framework')
jest.mock('@vechain/connex-driver')

describe('Product Routes', () => {
  let mockConnex

  beforeEach(() => {
    mockConnex = {
      thor: {
        account: jest.fn().mockReturnThis(),
        method: jest.fn().mockReturnThis(),
        call: jest.fn()
      },
      vendor: {
        sign: jest.fn().mockReturnThis(),
        request: jest.fn()
      }
    }

    Framework.mockImplementation(() => mockConnex)
    Driver.mockImplementation(() => ({}))
    SimpleNet.mockImplementation(() => ({}))
  })

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const { inputs, expects, mocks } = testData.post.success

      mockConnex.vendor.request.mockResolvedValue({ txid: mocks.txid })

      const response = await request(app)
        .post('/api/products')
        .send(inputs.newProduct)
        .expect(200)

      expect(response.body).toEqual(expects)
    })
  })

  describe('GET /api/products/:id', () => {
    it('should return a product by id', async () => {
      const { inputs, expects, mocks } = testData.get.success

      mockConnex.thor.call.mockResolvedValue({
        decoded: [mocks.decoded]
      })

      const response = await request(app)
        .get(`/api/products/${inputs.id}`)
        .expect(200)

      expect(response.body).toEqual(expects)
    })
  })

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const { inputs, expects, mocks } = testData.put.success

      mockConnex.vendor.request.mockResolvedValue({ txid: mocks.txid })

      const response = await request(app)
        .put(`/api/products/${testData.get.success.inputs.id}`)
        .send(inputs.updatedProduct)
        .expect(200)

      expect(response.body).toEqual(expects)
    })
  })
})
