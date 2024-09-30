const request = require('supertest')
const { thorify } = require('thorify')
const Web3 = require('web3')
const axios = require('axios')
const { waitForThor } = require('../utils')

const app = require('../../src/index') // Assuming your main file exports the app

describe('GET /', () => {
  let web3

  beforeAll(async () => {
    // Initialize Web3 with thorify
    web3 = thorify(new Web3(), process.env.THOR_URL || 'http://localhost:8669')
    // Wait for Thor node to be ready
    await waitForThor(web3)
  }, 60000) // Increased timeout for waiting

  it('should be able to reach Thor directly', async () => {
    try {
      const response = await axios.get('http://thor:8669/blocks/0')
      expect(response.status).toBe(200)
    } catch (error) {
      console.error('Error reaching Thor directly:', error)
      throw error
    }
  })

  it('should return the current block number', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('blockNumber')
    expect(typeof response.body.blockNumber).toBe('number')
    // Verify the block number with a direct Web3 call
    const actualBlockNumber = await web3.eth.getBlockNumber()
    expect(response.body.blockNumber).toBe(actualBlockNumber)
  }, 10000) // Increased timeout for blockchain interaction
})
