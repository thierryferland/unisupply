const express = require('express')
const { thorify } = require('thorify')
const Web3 = require('web3')
const routes = require('./routes')

const app = express()
const port = 3000

app.use(express.json()) // Add this line to parse JSON request bodies

const web3 = thorify(new Web3(), process.env.THOR_URL)

// Existing endpoint
app.get('/', async (req, res) => {
  try {
    const blockNumber = await web3.eth.getBlockNumber()
    res.json({ blockNumber })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Use the routes
app.use('/api', routes)

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})

module.exports = app
