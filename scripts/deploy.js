const { ethers } = require("hardhat")

async function main() {
  console.log("Deploying simplified WorldChainGuestbook contract...")

  // Get the contract factory
  const WorldChainGuestbook = await ethers.getContractFactory("WorldChainGuestbook")

  // Deploy the contract
  const guestbook = await WorldChainGuestbook.deploy()

  // Wait for deployment to complete
  await guestbook.waitForDeployment()

  const contractAddress = await guestbook.getAddress()
  console.log("WorldChainGuestbook deployed to:", contractAddress)

  // Verify deployment
  const entryCount = await guestbook.entryCount()
  const totalEntries = await guestbook.getTotalEntries()

  console.log("Contract Details:")
  console.log("- Entry Count:", entryCount.toString())
  console.log("- Total Entries:", totalEntries.toString())

  // Add some sample entries for testing
  console.log("\nAdding sample entries...")

  const [deployer, user1, user2] = await ethers.getSigners()

  // Add entries from different users
  await guestbook.connect(deployer).addEntry("Alice", "Hello World Chain! Excited to be here! 🌍")
  await guestbook.connect(user1).addEntry("Bob", "Building the future of decentralized identity! 🚀")
  await guestbook.connect(user2).addEntry("Charlie", "Amazing work on World Chain. Keep it up! 💫")
  await guestbook.connect(deployer).addEntry("Diana", "Love the simplicity of this guestbook! ✨")
  await guestbook.connect(user1).addEntry("Eve", "World Chain is the future of blockchain! 🔮")

  const finalEntryCount = await guestbook.getTotalEntries()
  console.log("Sample entries added. Total entries:", finalEntryCount.toString())

  // Test getting latest entries
  console.log("\nTesting latest entries...")
  const latestEntries = await guestbook.getLatestEntries(3)
  console.log("Latest 3 entries:")
  latestEntries.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.name}: ${entry.message}`)
  })

  return contractAddress
}

main()
  .then((contractAddress) => {
    console.log("\n✅ Deployment completed successfully!")
    console.log("Contract Address:", contractAddress)
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  })
