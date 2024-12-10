import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Voting from "build/Voting.json"; // Ensure correct path
import "./App.css";

const App = () => {
  const [account, setAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [votes, setVotes] = useState({});
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = Voting.networks[networkId];

        if (!deployedNetwork) {
          console.error("Contract not deployed on this network!");
          return;
        }

        const contractInstance = new web3Instance.eth.Contract(
          Voting.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);

        const candidateList = await contractInstance.methods
          .getCandidates()
          .call();
        setCandidates(candidateList);

        const voteCounts = {};
        for (let candidate of candidateList) {
          const voteCount = await contractInstance.methods
            .totalVotesFor(candidate)
            .call();
          voteCounts[candidate] = voteCount;
        }
        setVotes(voteCounts);
      } catch (error) {
        console.error("Error initializing the app:", error);
      }
    };
    init();
  }, []);

  const vote = async () => {
    if (!selectedCandidate) return;

    try {
      await contract.methods
        .voteForCandidate(selectedCandidate)
        .send({ from: account });

      const updatedVotes = {};
      for (let candidate of candidates) {
        const voteCount = await contract.methods
          .totalVotesFor(candidate)
          .call();
        updatedVotes[candidate] = voteCount;
      }
      setVotes(updatedVotes);
    } catch (error) {
      console.error("Error during voting:", error);
    }
  };

  return (
    <div className="App">
      <h1>Voting App</h1>
      <p>Account: {account}</p>
      <div>
        <h3>Select a candidate to vote</h3>
        <select
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
        >
          <option value="">-- Select Candidate --</option>
          {candidates.map((candidate, index) => (
            <option key={index} value={candidate}>
              {candidate}
            </option>
          ))}
        </select>
        <button onClick={vote} disabled={!selectedCandidate}>
          Vote
        </button>
      </div>
      <h3>Vote Counts</h3>
      <ul>
        {Object.entries(votes).map(([candidate, count]) => (
          <li key={candidate}>
            {candidate}: {count} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
