const { ethers } = require("hardhat")

async function main() {
  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = "0x..." // Add your contract address here

  console.log("Interacting with simplified WorldChainGuestbook at:", CONTRACT_ADDRESS)

  // Get contract instance
  const WorldChainGuestbook = await ethers.getContractFactory("WorldChainGuestbook")
  const guestbook = WorldChainGuestbook.attach(CONTRACT_ADDRESS)

  const [owner, user1, user2] = await ethers.getSigners()

  console.log("\n=== Contract Information ===")
  const totalEntries = await guestbook.getTotalEntries()
  console.log("Total entries:", totalEntries.toString())

  console.log("\n=== Adding New Entry ===")
  const tx = await guestbook
    .connect(user1)
    .addEntry("Developer", "Testing the simplified guestbook! Much cleaner now! 🎉")
  await tx.wait()
  console.log("Entry added successfully!")

  console.log("\n=== Getting Latest Entries ===")
  const latestEntries = await guestbook.getLatestEntries(5)

  console.log(`Showing ${latestEntries.length} latest entries:`)
  latestEntries.forEach((entry, index) => {
    console.log(`\nEntry ${index + 1}:`)
    console.log("- ID:", entry.id.toString())
    console.log("- Author:", entry.author)
    console.log("- Name:", entry.name)
    console.log("- Message:", entry.message)
    console.log("- Timestamp:", new Date(Number(entry.timestamp) * 1000).toLocaleString())
  })

  console.log("\n=== Getting Paginated Entries ===")
  const paginatedEntries = await guestbook.getEntries(0, 3) // Get first 3 entries
  console.log(`Showing first 3 entries (paginated):`)
  paginatedEntries.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.name}: ${entry.message}`)
  })

  console.log("\n=== Getting Entries by User ===")
  const userEntries = await guestbook.getEntriesByUser(user1.address)
  console.log(`User ${user1.address} has ${userEntries.length} entries:`)
  userEntries.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.name}: ${entry.message}`)
  })

  console.log("\n=== Getting Specific Entry ===")
  if (totalEntries > 0) {
    const specificEntry = await guestbook.getEntry(1) // Get first entry
    console.log("First entry details:")
    console.log("- Name:", specificEntry.name)
    console.log("- Message:", specificEntry.message)
    console.log("- Author:", specificEntry.author)
  }

  console.log("\n✅ Interaction completed successfully!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Interaction failed:", error)
    process.exit(1)
  })
