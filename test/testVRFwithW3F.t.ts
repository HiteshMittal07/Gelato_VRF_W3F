import hre, { deployments } from "hardhat";
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
    await deployments.fixture();

    contract = await ethers.getContract("SimpleContract");
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

    const depositAmount = ethers.parseEther("1.0");
    const tx = await dedicatedSigner.sendTransaction({
      to: contract.target,
      value: depositAmount,
    });
  });

  it("canExec: true - First execution", async () => {
    const data = ethers.encodeBytes32String("VRF test implementation");
    const tx = await contract.requestRandomness(data, { gasLimit: 1000000 });

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

  it("Checking event emitting", async () => {
    const data = ethers.encodeBytes32String("VRF test implementation");
    await expect(contract.requestRandomness(data)).to.emit(
      contract,
      "RequestedRandomness(uint256 round, bytes data)"
    );
  });
});
