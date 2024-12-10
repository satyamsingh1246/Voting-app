// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
contract Voting {
    // Mapping to store votes for each candidate
    mapping(string => uint256) public votesReceived;
    
    // Array to store candidate names
    string[] public candidateList;

    // Constructor to initialize candidates
    constructor(string[] memory candidateNames) {
        candidateList = candidateNames;
    }

    // Function to vote for a candidate
    function voteForCandidate(string memory candidate) public {
        votesReceived[candidate]++;
    }

    // Function to get the number of votes for a candidate
    function totalVotesFor(string memory candidate) public view returns (uint256) {
        return votesReceived[candidate];
    }
}
