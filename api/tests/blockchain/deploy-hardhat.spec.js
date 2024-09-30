const { thorify } = require('thorify')
const Web3 = require('web3')
const { waitForThor } = require('../utils')
const { deploy } = require('../../blockchain/deploy')
const hre = require('hardhat')
const testData = require('./deploy-hardhat.data')

describe('Contract Deployment', () => {
  let web3
  let address
  let product
  let supplier

  beforeAll(async () => {
    web3 = thorify(new Web3(), process.env.THOR_URL || 'http://localhost:8669')
    await waitForThor(web3);
    ({ address } = await deploy())
  }, 60000)

  beforeEach(async () => {
    const Supplier = await hre.ethers.getContractFactory('Supplier')
    supplier = await Supplier.attach(address)
    await supplier.deleteAllProducts()
  })

  it('should deploy the product contract successfully', async () => {
    const Product = await hre.ethers.getContractFactory('Product')
    product = await Product.attach(address)
    expect(product.functions.updateProduct).toBeDefined()
  }, 60000)

  it('should create a product successfully', async () => {
    const { expects, inputs } = testData.createProduct.success

    await supplier.addProduct(...inputs.addProduct)

    const productCount = await supplier.getProductCount()
    expect(productCount.toNumber()).toBe(1)

    const allProducts = await supplier.getProducts()
    expect(allProducts).toMatchObject(expects.products)
  }, 60000)

  it('should retrieve existing product from its address successfully', async () => {
    const { expects, inputs, inserts } = testData.getProduct.success

    await supplier.addProduct(...inserts.product)

    
    const products = await supplier.getProducts()
    const Product = await hre.ethers.getContractFactory('Product')
    product = await Product.attach(products[0].productAddress)
    const existingProduct = await product.productInfo();
    expect(existingProduct).toMatchObject(expects.product)
  }, 60000)
})
