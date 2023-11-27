import {task} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("myDeploy", "Deploys the contract")
    .addParam("name", "The name of the contract")
    .addParam("args", "The constructor arguments of the contract")
    //.addParam("libs", "The libraries used by the contract")
    //.addParam("gasLimit", "The gas limit for the deployment transaction")
    .setAction(async (taskArgs, hre, runSuper) => {
        const operator = (await hre.ethers.getSigners())[0];
        console.log(
            "\n",
            `deploy ${taskArgs.name}, operator:${operator.address
            }, args:${JSON.stringify(taskArgs.args)}`
        );
        const contract = await hre.ethers.deployContract(taskArgs.name, JSON.parse(taskArgs.args));
        await contract.waitForDeployment();
        console.log("\n", "Contract deployed to:", contract.target, "\n");
});
