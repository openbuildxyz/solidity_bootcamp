import {task} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("myVerify", "Verifies a contract on etherscan")
    .addParam("contract", "The contract's address")
    .addOptionalParam("args", "The constructor's arguments", '[]')
    .addOptionalParam("libs", "The libraries' addresses", '{}')
    .setAction(async (taskArgs, hre, runSuper) => {
        const {contract, args, libs} = taskArgs;
        console.log("Verifying contract", contract);
        console.log("Constructor arguments", args);
        console.log("Constructor arguments", JSON.parse(args));
        console.log("Libraries", libs);
        try {
            await hre.run("verify:verify", {
                address: taskArgs.contract,
                constructorArguments: JSON.parse(taskArgs.args),
                libraries: JSON.parse(taskArgs.libs),
            });

            console.log(`Contract ${taskArgs.contract} verified successfully`, "\n");
        } catch (error) {
            console.error("Failed to verify contract", error);
        }
    });
