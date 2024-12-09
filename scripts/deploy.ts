import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.deployContract("SimpleContract", [
    345,
    "0x61F2976610970AFeDc1d83229e1E21bdc3D5cbE4",
    "0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa",
    "0x2A6C106ae13B558BB9E2Ec64Bd2f1f7BEFF3A5E0",
    "0x745f19971E623775141D65440f5a4a2A83c25Ac3",
  ]);
  await contract.waitForDeployment();

  console.log("Contract Address:", contract.target);
}

main().catch((error: unknown) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
