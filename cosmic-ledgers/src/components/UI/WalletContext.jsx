import React, { createContext, useState, useContext } from 'react';

export const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [wallets, setWallets] = useState([
    { address: '0xu2172wad9di213sae', chain: 'supra' },
  ]);

  const addWallet = (newWallet) => {
    setWallets(currentWallets => [...currentWallets, newWallet]);
  };

  const removeWallet = (walletAddress) => {
    setWallets(currentWallets => currentWallets.filter(wallet => wallet.address !== walletAddress));
  };

  return (
    <WalletContext.Provider value={{ wallets, addWallet, removeWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}