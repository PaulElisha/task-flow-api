const { ethers } = require("hardhat")
const { assert } = require("chai")

describe("SimpleStorage", () => {

  let SimpleStorage;
  beforeEach(async () => {
    SimpleStorage = await ethers.deployContract("SimpleStorage")
  })

  it("should start with a favourite Number of 0", async () => {
    const currentval = await SimpleStorage.retrieve()
    const expectedVal = "0"

    assert.equal(currentval.toString(), expectedVal)
  })

  it("should update when we call store", async () => {
    const expectedVal = "9"
    const txRes = await SimpleStorage.store("9")
    await txRes.wait(1)

    const updatedVal = await SimpleStorage.retrieve();
    assert.equal(updatedVal.toString(), expectedVal)
  })

})