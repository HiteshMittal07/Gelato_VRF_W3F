import hre from "hardhat";
import { expect } from "chai";
import { before } from "mocha";
import {
  Web3FunctionUserArgs,
  Web3FunctionResultV2,
} from "@gelatonetwork/web3-functions-sdk";
import { Web3FunctionHardhat } from "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
const { ethers, w3f } = hre;
describe("SimpleContract Tests", function () {
  this.timeout(0);
  let contract: any;
  let simpleW3f: Web3FunctionHardhat;
  let userArgs: Web3FunctionUserArgs;
  let dedicatedSigner: any;

  before(async function () {
    const dedicatedMsgSenderAddress =
      "0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa";
    contract = await ethers.deployContract("SimpleContract", [
      345,
      "0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa",
      "0x2A6C106ae13B558BB9E2Ec64Bd2f1f7BEFF3A5E0",
      "0x745f19971E623775141D65440f5a4a2A83c25Ac3",
    ]);
    await contract.waitForDeployment();

    simpleW3f = w3f.get("Web3-Functions");
    const address = contract.target as string;
    userArgs = {
      consumerAddress: address,
    };

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [dedicatedMsgSenderAddress],
    });

    const balanceInWei = ethers.parseEther("100");
    const hexBalance = ethers.toBeHex(balanceInWei);

    await hre.network.provider.request({
      method: "hardhat_setBalance",
      params: [dedicatedMsgSenderAddress, hexBalance],
    });
    dedicatedSigner = await ethers.getSigner(dedicatedMsgSenderAddress);

    const data = ethers.encodeBytes32String("VRF test implementation");
    console.log(data);
    const tx = await contract
      .connect(dedicatedSigner)
      .requestRandomness(data, { gasLimit: 1000000 });
  });

  it("canExec: true - First execution", async () => {
    let { result } = await simpleW3f.run("onRun", { userArgs });
    result = result as Web3FunctionResultV2;

    expect(result.canExec).to.equal(true);
    if (!result.canExec) throw new Error("!result.canExec");

    const calldataNumber = result.callData[0];
    await dedicatedSigner.sendTransaction({
      to: calldataNumber.to,
      data: calldataNumber.data,
    });

    const updatedNumber = (
      await contract.connect(dedicatedSigner).myNumber()
    ).toString();

    console.log(updatedNumber);

    expect(updatedNumber).to.equal("5");
  });
});
