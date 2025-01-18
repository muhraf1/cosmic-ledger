import React, { useState } from "react";
import { Separator } from "./separator";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { Button } from "./button";
import SearchDialog from "./searchdialog";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table"; // Assuming you're using a UI component library like Radix UI for tables
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react";

const TransactionMenu = () => {
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
            { chainlogo: "./src/assets/eth_logo.png", chainname: "Ethereum", amount: "$75,000", percentage: "75%" },
            { chainlogo: "./src/assets/solana_logo.png", chainname: "Solana", amount: "$14,000", percentage: "14%" },
            { chainlogo: "./src/assets/sui_logo.png", chainname: "Sui", amount: "$11,000", percentage: "11%" }

        ],
        "EVM": [
            { chainlogo: "./src/assets/eth_logo.png", chainname: "Ethereum", amount: "$75,000", percentage: "100%" },
        ],
        "SVM": [
            { chainlogo: "./src/assets/solana_logo.png", chainname: "Solana", amount: "$14,000", percentage: "100%" },
        ],
        "Move": [
            { chainlogo: "./src/assets/sui_logo.png", chainname: "Sui", amount: "$11,000", percentage: "100%" }
        ]
    };

    const transactionData = {
        "All": [
            {
                date: "2025-01-05",
                typeicon: "./src/assets/sent_icon.png",
                type: "sent",
                chainname: "Ethereum",
                chainlogo: "./src/assets/eth_logo.png",
                amounttoken: "-0.00497683",
                amountusd: "-$14.67",
                currentprice: "1 ETH = $2,800"
            },
            {
                date: "2025-01-06",
                typeicon: "./src/assets/receive_icon.png",
                type: "receive",
                chainname: "Ethereum",
                chainlogo: "./src/assets/eth_logo.png",
                amounttoken: "+1",
                amountusd: "$2,800",
                currentprice: "1 ETH = $2,800"
            },
            {
                date: "2025-01-07",
                typeicon: "./src/assets/mint_icon.png",
                type: "mint",
                chainname: "Solana",
                chainlogo: "./src/assets/solana_logo.png",
                amounttoken: "1",
                amountusd: "$180",
                currentprice: "1 SOL = $180"
            },
            {
                date: "2025-01-08",
                typeicon: "./src/assets/swap_icon.png",
                type: "swap",
                chainname: "Binance Smart Chain",
                chainlogo: "./src/assets/bsc_logo.png",
                amounttoken: "+0.5",
                amountusd: "$1,000",
                currentprice: "1 BNB = $2,000"
            }
        ],
        "EVM": [
            {
                date: "2025-01-05",
                typeicon: "./src/assets/sent_icon.png",
                type: "sent",
                chainname: "Ethereum",
                chainlogo: "./src/assets/eth_logo.png",
                amounttoken: "-0.003",
                amountusd: "-$8.40",
                currentprice: "1 ETH = $2,800"
            },
            {
                date: "2025-01-06",
                typeicon: "./src/assets/receive_icon.png",
                type: "receive",
                chainname: "Polygon",
                chainlogo: "./src/assets/polygon_logo.png",
                amounttoken: "+100",
                amountusd: "$200",
                currentprice: "1 MATIC = $2"
            }
        ],
        "SVM": [
            {
                date: "2025-01-07",
                typeicon: "./src/assets/mint_icon.png",
                type: "mint",
                chainname: "Solana",
                chainlogo: "./src/assets/solana_logo.png",
                amounttoken: "2",
                amountusd: "$360",
                currentprice: "1 SOL = $180"
            }
        ],
        "Move": [
            {
                date: "2025-01-08",
                typeicon: "./src/assets/swap_icon.png",
                type: "swap",
                chainname: "Aptos",
                chainlogo: "./src/assets/aptos_logo.png",
                amounttoken: "+50",
                amountusd: "$250",
                currentprice: "1 APT = $5"
            }
        ]
    };
    
    const renderTransactionCards = (data) => (
        <div className="grid grid-cols-2 gap-4 mt-4">



    </div>
  );
   

    const renderSectionContent = () => {
        const data = chainData[activeSection] || [];
        const transactionList= transactionData[activeSection] || [];



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
                                <div key={index} className="flex flex-row p-4">
                                    <div className="flex space-x-1 w-full ">
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


                        {/* detailed transactions */}
                        <div className="w-full flex text-white text-xs font-bold justify-end">
                    
                        </div>
                        <Separator className="mt-3 mb-3 bg-white/10"></Separator>
                        {/* search & date picker */}
                        <div className="flex flex-row justify-start items-center gap-2">
                          
                                <div className="flex ">
                                    <DatePickerWithRange></DatePickerWithRange>
                                </div>
                               <SearchDialog></SearchDialog>
                        
                        </div>
                        {/*  TRANSACTION CARDS   */}
                       { renderTransactionCards(transactionList)}



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
            <div className=" flex-grow overflow-y-auto max-h-[180px]">
                <div className="mb-3">
                    <div className="mt-2">
                        {renderSectionContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionMenu;