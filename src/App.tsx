import React, { useCallback, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import "./App.css";

function useEthProvider() {
  const [metamaskProvider, setProvider] = useState(null) as any;
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestAccountsCB = useCallback(
    async (method: string) => {
      if (!metamaskProvider) return;

      try {
        setIsLoading(true);
        const accounts = await metamaskProvider.request({
          method,
        });
        setIsLoading(false);

        if (accounts.length === 0) {
          return;
        }

        setAccount(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    },
    [metamaskProvider]
  );

  useEffect(() => {
    (async () => {
      try {
        const provider = (await detectEthereumProvider({
          mustBeMetaMask: true,
        })) as any;

        if (provider) {
          setProvider(provider);
          requestAccountsCB("eth_accounts");
          provider.on("accountsChanged", async (accounts: string[]) => {
            if (accounts.length === 0) {
              return;
            }

            setAccount(accounts[0]);
          });
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [requestAccountsCB]);

  return { requestAccountsCB, account, isLoading };
}

function App() {
  const { requestAccountsCB, account, isLoading } = useEthProvider();

  return (
    <div className="App">
      {!account ? (
        <button
          onClick={async () => {
            await requestAccountsCB("eth_requestAccounts");
            window.location.reload();
          }}
          disabled={isLoading}
        >
          {isLoading ? "Loading" : "Connect your wallet"}
        </button>
      ) : (
        <div>{account}</div>
      )}
    </div>
  );
}

export default App;
