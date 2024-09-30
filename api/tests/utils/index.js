const waitForThor = async (web3, maxAttempts = 30, interval = 1000) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await web3.eth.getBlockNumber()
      console.log('Thor node is ready')
      return
    } catch (error) {
      console.log('error: ', error)
      console.log(`Waiting for Thor node... (attempt ${attempt + 1}/${maxAttempts})`)
      await new Promise(resolve => setTimeout(resolve, interval))
    }
  }
  throw new Error('Thor node is not ready after maximum attempts')
}

module.exports = {
  waitForThor
}
