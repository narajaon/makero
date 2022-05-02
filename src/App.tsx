import React, { useCallback, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import "./App.css";

function useProvider() {
  const [metamaskProvider, setProvider] = useState(null) as any;
  const [account, setAccount] = useState(null) as any;
  const [isLoading, setIsLoading] = useState(false);

  const requestAccountsCB = useCallback(async () => {
    if (metamaskProvider && !account) {
      setIsLoading(true);
      const accounts = await metamaskProvider.request({
        method: "eth_requestAccounts",
      });
      setIsLoading(false);

      setAccount(accounts[0]);
    }
  }, [metamaskProvider, account]);

  useEffect(() => {
    (async () => {
      const provider = (await detectEthereumProvider()) as any;

      if (provider) {
        setProvider(provider);
      }
    })();
  }, []);

  return { requestAccountsCB, account, isLoading };
}

function App() {
  const { requestAccountsCB, account, isLoading } = useProvider();
  console.log({ account, isLoading });

  return (
    <div className="App">
      {!account ? (
        <button onClick={requestAccountsCB} disabled={isLoading}>
          {isLoading ? "LOADING" : "CONNECT YOUR WALLET"}
        </button>
      ) : (
        <div>
          <div>YOUR WALLET IS CONNECTED</div>
          <div>Your account is: {account}</div>
        </div>
      )}
    </div>
  );
}

export default App;
