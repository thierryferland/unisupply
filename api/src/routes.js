const express = require('express')
const router = express.Router()
const productRoutes = require('./product/product.routes')

// Use product routes
router.use('/products', productRoutes)

module.exports = router
