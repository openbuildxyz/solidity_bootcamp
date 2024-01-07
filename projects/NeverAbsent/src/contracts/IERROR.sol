// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IERROR{
    error PlayerHasJoined(address player);
    error OutOfTeamLimit(uint teamNumber, uint teamLimit);
    error InvalidTime();
    error InvalidTeamId(uint teamId);
    error HasFinished();
}