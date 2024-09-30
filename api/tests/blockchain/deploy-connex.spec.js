const { thorify } = require('thorify')
const Web3 = require('web3')
const fs = require('fs')
const path = require('path')
const deployContract = require('../../blockchain/deploy')
const { waitForThor } = require('../utils')

describe('Contract Deployment', () => {
  let web3
  let contractAddress

  beforeAll(async () => {
    web3 = thorify(new Web3(), process.env.THOR_URL || 'http://localhost:8669')
    await waitForThor(web3)
  }, 60000)

  it('should deploy the contract successfully', async () => {
    await deployContract()

    const addressFile = path.resolve(__dirname, '../../contractAddress.json')
    expect(fs.existsSync(addressFile)).toBe(true)

    const addressData = JSON.parse(fs.readFileSync(addressFile, 'utf8'))
    expect(addressData).toHaveProperty('address')
    contractAddress = addressData.address

    expect(contractAddress).toMatch(/^0x[a-fA-F0-9]{40}$/)
  }, 60000)

  it('should have bytecode at the deployed address', async () => {
    const bytecode = await web3.eth.getCode(contractAddress)
    expect(bytecode).not.toBe('0x')
    expect(bytecode.length).toBeGreaterThan(2)
  })

  it('should be able to call a contract method', async () => {
    const productABI = [
      {
        inputs: [],
        name: 'productCount',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }
    ]

    const contract = new web3.eth.Contract(productABI, contractAddress)
    const productCount = await contract.methods.productCount().call()
    expect(Number(productCount)).toBe(0)
  })
})
