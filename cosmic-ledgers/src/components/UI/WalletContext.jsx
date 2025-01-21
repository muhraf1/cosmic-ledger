// walletcontext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const WalletContext = createContext();

export default function WalletProvider({ children }) {
  const initialWallets = JSON.parse(localStorage.getItem('wallets')) || [
    { address: 'EdL7bi7599Mwx9VDv8BVxdK7BD63Y1iVrgpZk7tZibuz', chain: 'solana' },
  ];

  const [wallets, setWallets] = useState(initialWallets);
  const [selectedWalletAddress, setSelectedWalletAddress] = useState(null); // Default to null for 'All Wallet'

  useEffect(() => {
    localStorage.setItem('wallets', JSON.stringify(wallets));
    if (wallets.length > 0 && selectedWalletAddress === null) {
      setSelectedWalletAddress(null); // Ensure 'All Wallet' is set if no specific wallet is selected
    }
  }, [wallets, selectedWalletAddress]);

  const addWallet = (newWallet) => {
    setWallets(currentWallets => [...currentWallets, newWallet]);
  };

  const removeWallet = (walletAddress) => {
    setWallets(currentWallets => currentWallets.filter(wallet => wallet.address !== walletAddress));
    if (walletAddress === selectedWalletAddress) {
      setSelectedWalletAddress(null); // Reset to 'All Wallet' if the removed wallet was selected
    }
  };

  const selectWallet = (address) => {
    setSelectedWalletAddress(address === 'All Wallet' ? null : address);
  };

  return (
    <WalletContext.Provider value={{ wallets, selectedWalletAddress, addWallet, removeWallet, selectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => useContext(WalletContext);