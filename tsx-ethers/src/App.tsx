import React, { useState } from 'react';
import './App.css';
import { ethers } from "ethers";

function App() {
  const [defaultAccount, setDefaultAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)

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
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      
      // MetaMask requires requesting permission to connect users accounts
      const connect  = await provider.send("eth_requestAccounts", []);
      setDefaultAccount(connect[0])
      // updateEthers()
      // The MetaMask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      // const signer = provider.getSigner()
    } else {
      alert("no meta mask wallet connected")
    }
  }
  return (
    <div>
      <button onClick={connect}>connect wallet</button>
      <button onClick={() => {console.log()}}>test</button>
    </div>
  );
}

export default App;
