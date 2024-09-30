exports.post = {
  success: {
    inputs: {
      newProduct: {
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        unitOfMeasure: 'piece'
      }
    },
    expects: {
      success: true,
      txId: 'mock_txid'
    },
    mocks: {
      txid: 'mock_txid'
    }
  }
}

exports.put = {
  success: {
    inputs: {
      updatedProduct: {
        name: 'Updated Product',
        price: 200,
        description: 'An updated test product',
        unitOfMeasure: 'kg'
      }
    },
    expects: {
      success: true,
      txId: 'mock_txid'
    },
    mocks: {
      txid: 'mock_txid'
    }
  }
}

exports.get = {
  success: {
    inputs: {
      id: '1'
    },
    expects: {
      id: '1',
      name: 'Test Product',
      price: '100',
      description: 'A test product',
      unitOfMeasure: 'piece'
    },
    mocks: {
      decoded: [['Test Product', '100', 'A test product', 'piece']]
    }
  }
}
