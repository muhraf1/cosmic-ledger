import React, { useState } from "react";

const VmMenu = () => {
    const [activeSection, setActiveSection] = useState("All");

    // Sections array
    const sections = [
        "All",
        "EVM",
        "SVM",
        "Move"
    ];
  // Dummy data for chain information
  const chainData = {
    "All": [
        { chainlogo: "./src/assets/supra_logo.png", chainname: "Supra", amount: "$5,000", percentage: "50%" },
        { chainlogo: "./src/assets/eth_logo.png", chainname: "Ethereum", amount: "$2,000", percentage: "20%" },
        { chainlogo: "./src/assets/solana_logo.png", chainname: "Solana", amount: "$2,000", percentage: "20%" },
        { chainlogo: "./src/assets/sui_logo.png", chainname: "Sui", amount: "$1,000", percentage: "10%" }

    ],
    "EVM": [
        { chainlogo: "./src/assets/eth_logo.png", chainname: "Ethereum", amount: "$2,000", percentage: "100%" },
    ],
    "SVM": [
        { chainlogo: "./src/assets/solana_logo.png", chainname: "Solana", amount: "$2,000", percentage: "100%" },
    ],
    "Move": [
        { chainlogo: "./src/assets/sui_logo.png", chainname: "Sui", amount: "$1,000", percentage: "100%" }
    ]
};

const protocolData ={
    "All": [
        { protocollogo: "./src/assets/wallet_logo.png", protocolname: "Wallet", amount: "$5,000", token:[
            { ticker:"Sup", tickerlogo:"./src/assets/supra_logo.png",price:"$1", Amount:"2500",USDvalue:"$1500" },
            { ticker:"ETH", tickerlogo:"./src/assets/eth_logo.png",price:"$3000", Amount:"0.43",USDvalue:"$1300" },
            { ticker:"WIF", tickerlogo:"./src/assets/wif_logo.png",price:"$1", Amount:"200",USDvalue:"$200" },
            { ticker:"SOL", tickerlogo:"./src/assets/sol_logo.png",price:"$190", Amount:"5,26",USDvalue:"$1000" },
            { ticker:"SUI", tickerlogo:"./src/assets/sui_logo.png",price:"$4,52", Amount:"221,2",USDvalue:"$1000" },


        ] },
        { protocollogo: "./src/assets/supra_logo.png", protocolname: "Delegation Pool 0", amount: "$3,500",token:[
            { ticker:"Sup", tickerlogo:"./src/assets/supra_logo.png",price:"3300 SUP", Amount:"200 SUP",USDvalue:"$3500"},

        ] },
        { protocollogo: "./src/assets/aave_logo.png", protocolname: "AAVE", amount: "$700",token:[
            { ticker:"USDC Bridged + ETH", tickerlogo:"./src/assets/usdc_eth_logo.png",price:"600 USDC +0,03 ETH", Amount:"3 USDC 0.00015 ETH",USDvalue:"$704"},

        ] },
        { protocollogo: "./src/assets/orca_logo.png", protocolname: "ORCA", amount: "$800",token:[
            { ticker:"JUP + SOLANA", tickerlogo:"./src/assets/usdc_eth_logo.png",price:"3 SOL 28,75 JUP", Amount:"0,0024 SOL 2,3 JUP",USDvalue:"$803"},

        ] },

    ],
    "EVM": [
        { protocollogo: "./src/assets/wallet_logo.png", protocolname: "Wallet", amount: "$1,300", token:[
            { ticker:"ETH", tickerlogo:"./src/assets/eth_logo.png",price:"$3000", Amount:"0.43",USDvalue:"$1300" },

        ]},

        { protocollogo: "./src/assets/aave_logo.png", protocolname: "AAVE", amount: "$700",token:[
            { ticker:"USDC Bridged + ETH", tickerlogo:"./src/assets/usdc_eth_logo.png",price:"600 USDC +0,03 ETH", Amount:"3 USDC 0.00015 ETH",USDvalue:"$704"},

        ] },
        
    ],
    "SVM": [
        { protocollogo: "./src/assets/wallet_logo.png", protocolname: "Wallet", amount: "$2,000", token:[
            { ticker:"WIF", tickerlogo:"./src/assets/wif_logo.png",price:"$1", Amount:"200",USDvalue:"$200" },
            { ticker:"SOL", tickerlogo:"./src/assets/sol_logo.png",price:"$190", Amount:"5,26",USDvalue:"$1000" },

        ]},    
        { protocollogo: "./src/assets/orca_logo.png", protcolname: "ORCA", amount: "$800",token:[
            { ticker:"JUP + SOLANA", tickerlogo:"./src/assets/usdc_eth_logo.png",price:"3 SOL 28,75 JUP", Amount:"0,0024 SOL 2,3 JUP",USDvalue:"$803"},

        ] }
    ],
    "Move": [
        { protocollogo: "./src/assets/wallet_logo.png", protocolname: "Wallet", amount: "$1,000", token:[
            { ticker:"SUI", tickerlogo:"./src/assets/sui_logo.png",price:"$4,52", Amount:"221,2",USDvalue:"$1000" }
        ]}
    ]
    };

const renderSectionContent = () => {
    const data = chainData[activeSection] || [];
    const dataprotocol = protocolData[activeSection] || [];
    
    switch (activeSection) {
        case "All":
        case "EVM":
        case "SVM":
        case "Move":
            return (
                // column
                <div className="flex flex-col">
            {/* section chain */}
                <div className="flex flex-row space-x-4">
                    {data.map((chain, index) => (
                        <div key={index} className="flex flex-row  p-4">
                            <div className="flex space-x-1 w-full">
                                <img 
                                    src={chain.chainlogo} 
                                    alt={chain.chainname}
                                    className="h-8 w-8 mr-2"
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium text-white/60 text-sm text-left">{chain.chainname}</span>
                                    <div className="flex flex-row justify-center items-center">
                                        <span className="font-bold text-white text-sm">{chain.amount}</span>
                                        <span className="font-medium text-white/60 text-xs ml-2">{chain.percentage}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                   
                </div>
                {/* section protocol & wallet  */}
                <h1>baso</h1>
                <div className="flex flex-row space-x-4 ">
                    {dataprotocol.map((protocol, index) => (
                        <div key={index} className="flex flex-row  p-4  ">
                            <div className="flex space-x-1 w-full  bg-[#4B2D68]">
                                <img 
                                    src={protocol.protocollogo} 
                                    alt={protocol.protocolname}
                                    className="h-8 w-8 mr-2"
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium text-white/60 text-sm text-left truncate">{protocol.protocolname}</span>
                                    <div className="flex flex-row justify-center items-center">
                                        <span className="font-bold text-white text-sm">{protocol.amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                   
                </div>

                </div>
                
            );
        default:
            return null;
    }
};


    return (
        <div className="bg-transparent rounded-md">
            {/* Section Bar Menu */}
            <div className="flex justify-between space-x-4  relative">
                {sections.map((section, index) => (
                    <button
                        key={section}
                        className={`
                            text-xs font-medium px-0 py-1 rounded-md transition-all duration-300 relative
                   flex-1
                            ${activeSection === section 
                                ? 'bg-white text-[#8C4FAD]' 
                                : 'bg-[#8C4FAD] text-white opacity-50 hover:opacity-100'}
                        `}
                        onClick={() => setActiveSection(section)}
                        aria-label={`Navigate to ${section} section`}
                    >
                        {section}
                    </button>
                ))}
            </div>

            {/* Section Content */}
            <div className=" flex-grow overflow-y-auto max-h-[200px]">
                <div className="mb-6">
                    <div className="mt-2">
                        {renderSectionContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VmMenu;