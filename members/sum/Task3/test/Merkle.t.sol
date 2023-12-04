pragma solidity ^0.8.20;
import {Test, console2} from "forge-std/Test.sol";
import {Merkle} from "../src/Merkle.sol";

contract MerkleTest is Test {
    Merkle public merkel;
    //hashes[0] = 0x78a93af7ef9f1380d64a61c552cbefc298da07acb65530265b8ade6ebe8218c4;
    //hashes[1] = 0x92ae03b807c62726370a4dcfecf582930f7fbb404217356b6160b587720d3ba7;
    //hashes[2] = 0xdca3326ad7e8121bf9cf9c12333e6b2271abe823ec9edfe42f813b1e768fa57b;
    //hashes[3] = 0x8da9e1c820f9dbd1589fd6585872bc1063588625729e7ab0797cfc63a00bd950;
    //hashes[4] = 0x995788ffc103b987ad50f5e5707fd094419eb12d9552cc423bd0cd86a3861433;
    //hashes[5] = 0x2f71627ef88774789455f181c533a6f7a68fe16e76e7a50362af377269aabfee;
    bytes32[] public hashes;
    //root = 0x2f71627ef88774789455f181c533a6f7a68fe16e76e7a50362af377269aabfee;
    bytes32 root;
    bytes32[] public proof;

    function setUp() public {
        merkel = new Merkle();
        string[4] memory transactions = [
            "alice -> bob",
            "bob -> dave",
            "carol -> alice",
            "dave -> bob"
        ];

        for (uint i = 0; i < transactions.length; i++) {
            hashes.push(keccak256(abi.encodePacked(transactions[i])));
        }

        uint n = transactions.length;
        uint offset = 0;

        while (n > 0) {
            for (uint i = 0; i < n - 1; i += 2) {
                hashes.push(
                    keccak256(
                        abi.encodePacked(hashes[offset + i], hashes[offset + i + 1])
                    )
                );
            }
            offset += n;
            n = n / 2;
        }
        root = hashes[hashes.length - 1];
    }


    function testMerklVerifyTrue() public {

       bytes32 leaf = hashes[0];
       proof.push(hashes[1]);
       proof.push(hashes[5]);
       bool result =  merkel.verify(proof, root, leaf, 0);
       assertTrue(result);
    }

    function testMerklVerifyFasle() public {
       bytes32 leaf = hashes[1];
    //    proof.pop();
    //    proof.pop();
    //    proof.push(hashes[0]);
    //    proof.push(hashes[5]);
       bool result =  merkel.verify(proof, root, leaf, 1);
       assertFalse(result);
    }
}

