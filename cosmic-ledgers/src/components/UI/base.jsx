
import React from "react";
import WalletSelect from "./walletselect";


const BaseLayer = ({children }) => {
    return (
        <div className="flex flex-col w-full">
        <div className="grid justify-items-stretch p-4">
          <div className="flex items-center justify-between w-full">
           {/* main cards */}
           <div className="w-full h-full glass  ">
          <WalletSelect></WalletSelect>
          <h1 className="test">net worth performance</h1>
        
        </div>
          </div>
        </div>
  
        <main className="flex-grow">
          {children}    
        </main>
  
       
      </div>
    )
}


export default BaseLayer;