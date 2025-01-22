// walletselect.jsx

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWalletContext } from "./WalletContext";

const WalletSelect = () => {
  const { wallets, selectWallet } = useWalletContext();

  return (
    <div className="w-full flex justify-between p-2 py-4 pt-6">
      <div className="w-full">
        <Select onValueChange={selectWallet}>
          <SelectTrigger className="w-[300px] bg-white text-[#B470D8]">
            <SelectValue placeholder="Select a Wallet" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-[#B470D8]">Wallets</SelectLabel>
              <SelectItem 
                value="All Wallet" 
                className="text-[#B470D8] hover:text-[#ffff] hover:bg-[#B470D8]"
              >
                All Wallet
              </SelectItem>
              {wallets.map((wallet, index) => (
                <SelectItem 
                key={wallet.address}
                value={wallet.address} 
                className="text-[#B470D8] hover:text-[#ffff] hover:bg-[#B470D8] px-3 py-2 flex items-center"
              >
                <img 
                  src={`./src/assets/${wallet.chain}_logo.png`} 
                  alt={`${wallet.chain} Logo`}
                  className="w-6 h-6 mr-2"
                />
                <span className="truncate" title={wallet.address}>
                  {wallet.address}
                </span>
              </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* age of wallet */}
      <div>
        <Button className="bg-[#8C4FAD]">700 Days</Button>
      </div>
    </div>
  );
};

export default WalletSelect;