import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [currentBalance, setcurrentBalance] = useState(0);
  const [ethSupply, setEthSupply] = useState(0);
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
        const { result } = await (
          await fetch(
            `https://api-ropsten.etherscan.io/api?module=account&action=txlistinternal&address=${process.env.REACT_APP_META_MASK_KEY}&startblock=0&endblock=2702578&page=1&offset=10&sort=asc&apikey=${process.env.REACT_APP_ETHER_SCAN_URL}`
          )
        ).json();

        console.log({ result });

        // const res = await data.json();

        // @ts-ignore
        const balance = await provider.request({
          method: "eth_getBalance",
          params: [process.env.REACT_APP_META_MASK_KEY, "latest"],
        });
        console.log({ balance });

        setcurrentBalance(Number.parseInt(balance, 16) * 10 ** -18);

        setEthSupply(result);
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
          Learn How to MAKERO, You currently have ${currentBalance} ETH
        </a>
        <ul>
          <li>There is currently {ethSupply} ETH in circulation</li>
        </ul>
      </header>
    </div>
  );
}

export default App;
