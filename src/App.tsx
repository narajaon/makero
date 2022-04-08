import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [currentBalance, setcurrentBalance] = useState(0);
  useEffect(() => {
    (async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        console.log("Ethereum successfully detected!");

        // From now on, this should always be true:
        // provider === window.ethereum

        // Access the decentralized web!

        // Legacy providers may only have ethereum.sendAsync
        // @ts-ignore
        const chainId = await provider.request({
          method: "eth_chainId",
        });

        console.log({ chainId });

        console.log({
          url: process.env.REACT_APP_ETHER_SCAN_URL,
          meta: process.env.REACT_APP_META_MASK_KEY,
        });

        // @ts-ignore
        const data = await fetch(process.env.REACT_APP_ETHER_SCAN_URL);
        const res = await data.json();
        console.log({ res });

        // @ts-ignore
        const balance = await provider.request({
          method: "eth_getBalance",
          params: [process.env.REACT_APP_META_MASK_KEY, "latest"],
        });

        setcurrentBalance(Number.parseInt(balance, 16) * 10 ** -18);
      } else {
        // if the provider is not detected, detectEthereumProvider resolves to null
        console.error("Please install MetaMask!");
      }
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>APP MAKERO</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn How to MAKERO, You currently have ${currentBalance} wei
        </a>
      </header>
    </div>
  );
}

export default App;
