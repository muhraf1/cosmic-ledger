import { useState } from 'react';

export function useWallet(initialWallets = []) {
  const [wallets, setWallets] = useState(initialWallets);

  return {
    wallets,
    addWallet: (newWallet) => {
      setWallets(currentWallets => [...currentWallets, newWallet]);
    },
    removeWallet: (walletAddress) => {
      setWallets(currentWallets => currentWallets.filter(wallet => wallet.address !== walletAddress));
    }
  };
}