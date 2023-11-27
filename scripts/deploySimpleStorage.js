const { ethers, run, network } = require("hardhat");

const deploy = async () => {

  const SimpleStorage = await ethers.deployContract("SimpleStorage");
  console.log("Deploying contract...");
  await SimpleStorage.waitForDeployment();
  console.log(`Contract Deployed to: ${SimpleStorage.target}`)


  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    await SimpleStorage.waitForDeployment(6);
    await verify(SimpleStorage.target, [])
  } else {
    console.log("Contract cannot be verified on Hardhat Network")
  }
  /// Interacting with deployed Contract

  const num = await SimpleStorage.retrieve();
  console.log(`Number is: ${num}`);

  // update number value

  const txRes = await SimpleStorage.store(9);
  await txRes.wait(6);
  const newVal = await SimpleStorage.retrieve()
  console.log(`Updated Number is: ${newVal}`);

}

const verify = async (contractAddress, args) => {
  console.log("Verifying contract....")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgs: args
    })
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified...!")
    } else {
      console.log(error);
    }
  }

}
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
