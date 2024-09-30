const express = require('express')
const router = express.Router()
const productController = require('./product.controller')

// Create a new product
router.post('/', productController.createProduct)

// Get a product by ID
router.get('/:id', productController.getProduct)

// Update a product
router.put('/:id', productController.updateProduct)

module.exports = router
