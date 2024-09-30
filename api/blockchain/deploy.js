const hre = require("hardhat");

exports.deploy = async () => {
  // Get the contract factory
  const Supplier = await hre.ethers.getContractFactory("Supplier");

  // If your constructor takes arguments, add them here
  const supplier = await Supplier.deploy();

  // Wait for the contract to be deployed
  await supplier.deployed();

  console.log("Producer contract deployed to:", supplier.address);

  // Save the contract address to a file
  return { address: supplier.address }
}
