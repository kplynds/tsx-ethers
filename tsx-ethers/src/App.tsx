import React, { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import truncateEthAddress from "truncate-eth-address";
import axios from "axios";
import { FaEthereum } from "react-icons/fa";

function App() {
  const [connectedAccount, setConnectedAccount] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const [currentBalance, setCurrentBalance] = useState<string>();
  const [currentBalanceLoading, setCurrentBalanceLoading] = useState<boolean>(
    false
  );
  const [sendEthTo, setSendEthTo] = useState<string>("");
  const [amountOfEth, setAmountOfEth] = useState<string>("");
  const [gasPrice, setGasPrice] = useState<string>("");
  const [ethPrice, setEthPrice] = useState("");
  // const [transactionPreviewed, setTransactionPreviewed] = useState<any>(false);
  const [validatingTransaction, setValidatingTransaction] = useState(false);
  const [addressNotFound, setAddressNotFound] = useState(false);
  const [addressFound, setAddressFound] = useState("");
  const [sendingEth, setSendingEth] = useState(false);
  const [tx, setTx] = useState<string>("");
  const [searchValue, setSearchVallue] = useState("");
  const [queriedBalance, setQueriedBalance] = useState("");
  const [queriedAddress, setQueriedAddress] = useState("");
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
  const searchEthName = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .getBalance(searchValue)
      .then((res) => {
        setQueriedBalance(ethers.utils.formatEther(res));
        setQueriedAddress(searchValue);
      })
      .catch((err) => {
        alert("This address cannot be found!");
      });
    } else {
      alert("please install a eth browser extension like metamask!")
    }
  };
  useEffect(() => {
    if (
      connectedAccount &&
      (sendEthTo.endsWith(".eth") || sendEthTo.length === 42) &&
      amountOfEth !== ""
    ) {
      setValidatingTransaction(true);
      if (sendEthTo.endsWith(".eth")) {
        provider
          .getResolver(sendEthTo)
          .then((res: any) => {
            if (res) {
              setAddressNotFound(false);
              setValidatingTransaction(false);
              setAddressFound(
                `${truncateEthAddress(res.address)} (${sendEthTo})`
              );
            } else {
              setAddressNotFound(true);
              setValidatingTransaction(false);
            }
          })
          .catch((err: any) => {
            alert("error verifying this eth address");
            console.error(err);
          });
      } else {
        provider
          .getBalance(sendEthTo)
          .then((res: any) => {
            setAddressNotFound(false);
            setAddressFound(truncateEthAddress(sendEthTo));
            setValidatingTransaction(false);
          })
          .catch((err: any) => {
            setAddressNotFound(true);
            setValidatingTransaction(false);
          });
      }
    } else {
      setAddressFound("");
    }
  }, [connectedAccount, sendEthTo, amountOfEth, provider]);
  useEffect(() => {
    if (connectedAccount) {
      setCurrentBalanceLoading(true);
      provider.getBalance(connectedAccount).then((res: any) => {
        setCurrentBalance(ethers.utils.formatEther(res));
        setCurrentBalanceLoading(false);
      });
    }
  }, [connectedAccount, provider]);
  useEffect(() => {
    axios
      .get("https://etherchain.org/api/gasnow")
      .then((res) => {
        setEthPrice(res.data.data.priceUSD);
      })
      .catch((err) => {
        setEthPrice("* error getting eth price *");
        console.log(err.response);
      });
    axios
      .get(
        "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=Z33CCQNUJW87FDB1GD5ERZR7N35Y6DA4IW"
      )
      .then((res) => {
        setGasPrice(res.data.result.ProposeGasPrice);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 className="text-3xl font-bold underline m-auto mt-5 mb-2">
        Eth Explorer
      </h1>
      <p className="font-bold py-2 px-4 rounded mt-3">
        <FaEthereum style={{ display: "inline" }} /> current eth price: $
        {ethPrice}
      </p>
      <p className="font-bold py-2 px-4 rounded mt-3">
        ⛽️ current gas price ~ ${gasPrice}
      </p>
      {connectedAccount ? (
        <p className="font-bold py-2 px-4 rounded mt-3">
          🔗 wallet connected: {truncateEthAddress(connectedAccount)}
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
        <p className="font-bold text-sm py-2 px-4 rounded mb-3">
          💲 Your Balance:{" "}
          {currentBalanceLoading ? "loading..." : currentBalance?.substr(0, 7)}{" "}
          {!currentBalanceLoading && "eth"}
        </p>
      )}
      {connectedAccount && (
        <div className="text-center border-solid border-t-2 border-sky-500 w-80">
          <p className="font-bold py-2 px-4 rounded mb-2">Send Eth</p>
        </div>
      )}
      {connectedAccount && (
        <div className="mb-3 pt-0">
          {/* <p className="font-bold py-2 px-4 rounded mt-3 text-lg">Send Eth</p> */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label className="block mb-2 text-sm font-medium text-black">
              Address (full or ENS)
            </label>
          </div>
          <div
            style={{
              flexDirection: "column",
              alignItems: "center",
              display: "flex",
            }}
          >
            <input
              type="text"
              placeholder="Address (ex: vitalik.eth)"
              className="px-1 py-1 placeholder-slate-350 text-slate-600 relative bg-white bg-white rounded text-sm border border-slate-350 outline-none focus:outline-none focus:ring w-full mb-2"
              value={sendEthTo}
              onChange={(e: any) => {
                setSendEthTo(e.target.value);
              }}
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <label className="block mb-2 text-sm font-medium text-black">
                amount (in eth)
              </label>
            </div>
            <input
              className="px-1 py-1 placeholder-slate-350 text-slate-600 relative bg-white bg-white rounded text-sm border border-slate-350 outline-none focus:outline-none focus:ring w-full"
              style={{ width: "4rem" }}
              placeholder="1.0"
              type="number"
              value={amountOfEth}
              onChange={(e: any) => {
                setAmountOfEth(`${e.target.value}`);
              }}
            />
          </div>
        </div>
      )}
      {connectedAccount && (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-1 disabled:opacity-40 disabled:hover:bg-red-500"
          onClick={async () => {
            try {
              setSendingEth(true);
              await window.ethereum.send("eth_requestAccounts");
              const newProvider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const signer = newProvider.getSigner();
              const tx = await signer.sendTransaction({
                to: sendEthTo,
                value: ethers.utils.parseEther(amountOfEth),
              });
              setTx(tx.hash);
              setSendEthTo("");
              setAmountOfEth("");
              setAddressFound("");
              setSendingEth(false);
            } catch {
              alert("error!");
            }
          }}
          disabled={!addressFound || addressNotFound || sendingEth}
        >
          {validatingTransaction
            ? "validating..."
            : sendingEth
            ? "sending..."
            : addressNotFound
            ? "this eth address could not be found"
            : addressFound
            ? `send ${amountOfEth} eth to ${addressFound}`
            : "send"}
        </button>
      )}
      {tx !== "" && (
        <div style={{ textAlign: "center" }}>
          <p className="font-bold py-2 px-4 rounded mt-3">
            Success! Your transaction hash can be found below:
          </p>
          <a
            href={`https://etherscan.io/tx/${tx}`}
            className="py-2 px-4 rounded mt-3 underline"
          >
            {tx}
          </a>
        </div>
      )}
      <div className="text-center border-solid border-t-2 border-sky-500 w-80 mt-6">
        <p className="font-bold py-2 px-4 rounded mb-2">
          Explore Eth Blockchain
        </p>
      </div>
      <label className="block mb-2 text-sm font-medium text-black">
        See Eth Balance
      </label>
      <div className="flex">
        <input
          type="text"
          placeholder="Search by address or ENS"
          className="px-3 py-1 h-9 w-64 placeholder-slate-350 text-slate-600 bg-white bg-white rounded text-sm border border-slate-350 outline-none focus:outline-none focus:ring"
          value={searchValue}
          onChange={(e: any) => {
            setSearchVallue(e.target.value);
          }}
        />
        <button
          className="px-5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
          type="button"
          onClick={searchEthName}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="search"
            className="w-4"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
            ></path>
          </svg>
        </button>
      </div>
      {queriedBalance !== "" && (
        <p className="font-bold text-sm py-2 px-4 rounded">
          💲 Balance: {queriedBalance}
        </p>
      )}
      {queriedBalance !== "" && (
        <p className="font-bold text-sm rounded mb-3">({queriedAddress})</p>
      )}
    </div>
  );
}

export default App;
