// import
const { ethers, run, network } = require("hardhat");

//async main

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying Contract...");
  console.log(process.env.PRIVATE_KEY);

  const simpleStorage = await SimpleStorageFactory.deploy();
  //   await simpleStorage.deployed()
  const address = await simpleStorage.getAddress();
  console.log(`Deploying Contracts...${address}`);
  //what happens when we want to deploy this to hardhart network
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmation");
    await simpleStorage.deploymentTransaction().wait(6);
    await verify(simpleStorage.target, []);
  }
  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is : ${currentValue}`);

  //Update the current Value
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is : ${updatedValue}`);
}
const verify = async (contractAddress, args) => {
  console.log("Verifying contracts");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(e);
    }
  }
};
//main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error), process.exit(1);
  });
