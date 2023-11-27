import {task} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("myBalance", "Prints an account's balance")
    .addParam("addr", "The address to get the balance of")
    .setAction(async (taskArgs, hre, runSuper) => {
    console.log("balance of", taskArgs.addr, "is", 
        hre.ethers.formatEther((await hre.ethers.provider.getBalance(taskArgs.addr))), "ETH");
});


