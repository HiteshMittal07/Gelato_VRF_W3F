import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploySimpleContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const constructorArguments = [
    345,
    "0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa",
    "0x2A6C106ae13B558BB9E2Ec64Bd2f1f7BEFF3A5E0",
    "0x745f19971E623775141D65440f5a4a2A83c25Ac3",
  ];

  const result = await deploy("SimpleContract", {
    from: deployer,
    args: constructorArguments,
    log: true,
  });

  console.log("SimpleContract deployed at:", result.address);
};

export default deploySimpleContract;

deploySimpleContract.tags = ["SimpleContract"];
