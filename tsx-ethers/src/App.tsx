import React, { useState } from "react";
import "./App.css";
import { ethers } from "ethers";

function App() {
  const [connectedAccount, setConnectedAccount] = useState<any>();
  const [provider, setProvider] = useState<any>();

  // const updateEthers = () => {
  // 	let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
  // 	setProvider(tempProvider);

  // 	let tempSigner = tempProvider.getSigner();
  // 	setSigner(tempSigner);
  // }
  const connect = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      // A Web3Provider wraps a standard Web3 provider, which is
      // what MetaMask injects as window.ethereum into each page
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // MetaMask requires requesting permission to connect users accounts
      const connect = await provider.send("eth_requestAccounts", []);
      setProvider(provider);
      setConnectedAccount(connect[0]);
      // updateEthers()
      // The MetaMask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      // const signer = provider.getSigner()
    } else {
      alert("no meta mask wallet connected");
    }
  };
  const getBalance = async (address: string) => {
    const te = await provider.getBalance(address);
    return ethers.utils.formatEther(te);
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 className="text-3xl font-bold underline m-auto mt-5 mb-3">
        Ethers.js
      </h1>
      {connectedAccount ? (
        <p className="font-bold py-2 px-4 rounded mt-3 mb-3">
          connected wallet: {connectedAccount}
        </p>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-3"
          onClick={connect}
        >
          connect wallet
        </button>
      )}
      {connectedAccount && (
        <p className="font-bold py-2 px-4 rounded mt-3 mb-3">
          my balance: {getBalance(connectedAccount)}
        </p>
      )}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-1"
        onClick={async () => {
          const te = await provider.getBalance("pbandj.eth");
          console.log(ethers.utils.formatEther(te));
        }}
      >
        testing
      </button>
    </div>
  );
}

export default App;
