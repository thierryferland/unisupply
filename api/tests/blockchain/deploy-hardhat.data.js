const { ethers } = require("hardhat");

const existingProduct = [
  'Product 2',
  102,
  'Description 2',
  'Unit 1'
]

const newProduct = [
  'Product 1',
  100,
  'Description 1',
  'Unit 1'
]

exports.createProduct = {
  success: {
    expects: {
      products: [
        {
          productAddress: expect.stringMatching(/^0x[a-fA-F0-9]{40}$/),
          productInfo: {
            name: "Product 1",
            price: ethers.BigNumber.from(100),
            description: "Description 1",
            unitOfMeasure: "Unit 1",
            isActive: true
          }
        }
      ],
      price: 100
    },
    inputs: {
      addProduct: newProduct
    }
  }
}

exports.getProduct = {
  success: {
    inserts: {
      product: existingProduct
    },
    expects: {
      product: {
        name: "Product 2",
        price: ethers.BigNumber.from(102),
        description: "Description 2",
        unitOfMeasure: "Unit 1",
        isActive: true
      },
      price: 102
    },
    inputs: {
      getProduct: 2
    }
  }
}
