
import React from "react";
import WalletSelect from "./walletselect";
import Content from "./contentchart";
import Navbar from "./navbar";

const BaseLayer = ({children }) => {
    return (
   
      <div className="flex items-center justify-between">
           {/* main cards */}
           <div className="custom-width mx-auto h-full glass px-10 pb-3">
           <WalletSelect></WalletSelect>
           <Content></Content>
          <div className="w-full justify-items-end mt-2">
          <img  className="h-8 w-auto 	" src="./src/assets/name_logo.png"/>  
          </div>
         
    
        
        </div>
     
  
     
      </div>
    )
}


export default BaseLayer;