import React, { useState } from "react";
import { Button } from "./button";
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";

const FusionMenus = ({ wallets, addWallet, removeWallet }) => {
  const [newWallet, setNewWallet] = useState({ address: '', chain: 'supra' });

  const handleSave = () => {
    if (newWallet.address && newWallet.chain) {
      addWallet(newWallet);
      setNewWallet({ address: '', chain: 'supra' }); // Reset form
    }
  };

  const handleWalletChange = (e) => {
    setNewWallet({ ...newWallet, address: e.target.value });
  };

  const handleChainChange = (value) => {
    setNewWallet({ ...newWallet, chain: value });
  };

  const handleRemoveWallet = (address) => {
    removeWallet(address);
  };

  return (
    <div className="flex flex-col overflow-y-auto min-h-[18 0px] max-h-[180px] relative">
      {/* Display Existing Wallets */}
      <div className="flex flex-col gap-2 mx-10 px-4">
        {wallets.map((wallet, index) => (
          <div key={index} className="flex bg-white/5 items-center justify-between w-full rounded-lg p-2">
            <span className="text-white truncate ... overflow-hidden w-[230px]">{wallet.address}</span>
            <div className="flex items-center">
              <img 
                className="w-8 h-8 rounded-full mr-2"
                src={`./src/assets/${wallet.chain}_logo.png`} 
                alt={`${wallet.chain} Logo`}
              />
              <button 
                onClick={() => handleRemoveWallet(wallet.address)} 
                className="text-white text-sm  hover:text-red-500  bg-white/10 focus:outline-none">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Add Button */}
      <div className="sticky bottom-0 w-full bg-white/5 rounded-b-lg backdrop-blur mt-2 z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#8C4FAD] border border-white/5 mt-2 mb-2 text-white font-bold" variant="outline">Add Wallets</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#8C4FAD]/60 border border-white/10 backdrop-blur">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Wallet</DialogTitle>
              <DialogDescription className="text-white">
                Enter the details of the wallet you want to add.
              </DialogDescription>
            </DialogHeader>

            <div className="p-1 px-4 mx-10">
              {/* Wallet Input */}
              <div className="flex bg-transparent justify-between gap-2">
                <div className="flex bg-white/5 items-center w-full rounded-l-lg p-1 justify-center">
                  <Input
                    className="text-white border-0 text-right placeholder:text-white/40"
                    placeholder="Input Wallet"
                    type="text"
                    aria-label="Enter wallet address"
                    value={newWallet.address}
                    onChange={handleWalletChange}
                  />
                </div>
                <div className="flex bg-white/5 items-center rounded-r-lg p-2 px-3 justify-center">
                  <Select value={newWallet.chain} onValueChange={handleChainChange}>
                    <SelectTrigger className="w-full border-0 bg-transparent">
                      <img 
                        className="w-8 h-7 rounded-full"
                        src={`./src/assets/${newWallet.chain}_logo.png`} 
                        alt={`${newWallet.chain} Logo`}
                      />
                    </SelectTrigger>
                    <SelectContent className="border-0 bg-white/10 backdrop-blur text-white">
                      {[
                        { value: 'supra', label: 'Supra', img: './src/assets/supra_logo.png' },
                        { value: 'ethereum', label: 'Ethereum', img: './src/assets/eth_logo.png' },
                        { value: 'sui', label: 'Sui', img: './src/assets/sui_logo.png' },
                        { value: 'solana', label: 'Solana', img: './src/assets/solana_logo.png' },
                      ].map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <div className="flex items-center">
                            <img 
                              className="w-8 h-8 rounded-full mr-2"
                              src={item.img} 
                              alt={`${item.label} Logo`}
                            />
                            {item.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSave} type="button" className="py-2 px-4 bg-white/10 text-white backdrop-blur">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FusionMenus;