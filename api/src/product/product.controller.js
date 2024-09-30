const { Framework } = require('@vechain/connex-framework')
const { Driver, SimpleNet, SimpleWallet } = require('@vechain/connex-driver')
const { asyncAction } = require('../utils')

const wallet = new SimpleWallet()
const driver = new Driver(new SimpleNet(process.env.THOR_URL))
const connex = new Framework(driver)

// Product smart contract ABI (simplified for this example)
const productABI = {
  abi: [
    {
      name: 'createProduct',
      type: 'function',
      inputs: [
        { name: 'name', type: 'string' },
        { name: 'price', type: 'uint256' },
        { name: 'description', type: 'string' },
        { name: 'unitOfMeasure', type: 'string' }
      ],
      outputs: []
    },
    {
      name: 'getProduct',
      type: 'function',
      inputs: [
        { name: 'id', type: 'uint256' }
      ],
      outputs: [
        { name: 'name', type: 'string' },
        { name: 'price', type: 'uint256' },
        { name: 'description', type: 'string' },
        { name: 'unitOfMeasure', type: 'string' }
      ]
    }
  ]
}

// Assuming your smart contract address
const contractAddress = '0x1234567890123456789012345678901234567890'

exports.createProduct = asyncAction(async (req, res) => {
  const { name, price, description, unitOfMeasure } = req.body

  const method = connex.thor.account(contractAddress).method(productABI.abi.find(x => x.name === 'createProduct'))
  const clause = method.asClause(name, price, description, unitOfMeasure)

  const result = await connex.vendor.sign('tx', [clause]).request()

  res.json({ success: true, txId: result.txid })
})

exports.getProduct = asyncAction(async (req, res) => {
  const { id } = req.params

  const method = connex.thor.account(contractAddress).method(productABI.abi.find(x => x.name === 'getProduct'))
  const result = await method.call(id)

  const [name, price, description, unitOfMeasure] = result.decoded[0]

  res.json({ id, name, price: price.toString(), description, unitOfMeasure })
})

exports.updateProduct = asyncAction(async (req, res) => {
  const { id } = req.params
  const { name, price, description, unitOfMeasure } = req.body

  const method = connex.thor.account(contractAddress).method(productABI.abi.find(x => x.name === 'updateProduct'))
  const clause = method.asClause(id, name, price, description, unitOfMeasure)

  const result = await connex.vendor.sign('tx', [clause]).request()

  res.json({ success: true, txId: result.txid })
})
