import React from "react";
import WalletSelect from "./walletselect";
import Content from "./contentchart";
import Navbar from "./navbar";
import WalletProvider, { useWalletContext } from "./WalletContext";

const BaseLayer = ({ children }) => {
  return (
    <WalletProvider>
      <div className="flex items-center justify-between">
        {/* main cards */}
        <div className="custom-width mx-auto h-full glass px-10 pb-3">
          <WalletSelect />
          <Content />
          <div className="w-full justify-items-end mt-2">
            <img className="h-8 w-auto" src="./src/assets/name_logo.png" />
          </div>
        </div>
      </div>
    </WalletProvider>
  );
};

export default BaseLayer;