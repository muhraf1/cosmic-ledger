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
                tokenlogo: "./src/assets/eth_logo.png",
                amounttoken: "-0.00497683",
                amountusd: "-$14.67",
                currentprice: "1 ETH = $2,800"
            },
            {
                date: "2025-01-05",
                typeicon: "./src/assets/sent_icon.png",
                type: "sent",
                chainname: "Ethereum",
                chainlogo: "./src/assets/eth_logo.png",
                tokenlogo: "./src/assets/eth_logo.png",
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
                tokenlogo: "./src/assets/eth_logo.png",
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
                tokenlogo: "./src/assets/madslads_nft.png",
                amounttoken: "1",
                amountusd: "$180",
                currentprice: "1 SOL = $180"
            },
            {
                date: "2025-01-08",
                typeicon: "./src/assets/swap_icon.png",
                type: "swap",
                chainname: "Binance Smart Chain",
                chainlogo: "./src/assets/bnb_logo.png",
                tokenlogo: "./src/assets/bnb_logo.png",
                amounttoken: "+0.5",
                amountusd: "$1,000",
                currentprice: "1 BNB = $2,000"
            }
        ],
        "EVM": [
            {
                date: "2025-01-05",
                typeicon: "./src/assets/mint_icon.png",
                type: "mint",
                chainname: "Ethereum",
                chainlogo: "./src/assets/eth_logo.png",
                tokenlogo: "./src/assets/pudgy_nft.png",
                amounttoken: "-0.003",
                amountusd: "-$8.40",
                currentprice: "1 ETH = $2,800"
            },
            {
                date: "2025-01-06",
                typeicon: "./src/assets/receive_icon.png",
                type: "receive",
                chainname: "Polygon",
                chainlogo: "./src/assets/polygon_logo.svg",
                tokenlogo: "./src/assets/polygon_logo.svg",
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
                tokenlogo: "./src/assets/madslads_nft.png",
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
                chainname: "Sui",
                chainlogo: "./src/assets/sui_logo.png",
                tokenlogo: "./src/assets/sui_logo.png",
                amounttoken: "+50",
                amountusd: "$250",
                currentprice: "1 sui = $5"
            }
        ]
    };
    
    const renderTransactionCards = (transactionList) => (
        <div className="grid grid-cols-1 gap-4 mt-4">
            {transactionList.map((tx, index) => {
                // Group transactions by date
                if (index === 0 || tx.date !== transactionList[index - 1].date) {
                    // Parse the date string into a Date object
                const dateObj = new Date(tx.date);
                const day = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const monthDay = dateObj.getDate();
                const year = dateObj.getFullYear();
                
                // Format the date
                const formattedDate = `${day} ${monthDay}, ${year}`;
                    return (
                        <div key={tx.date} className="flex flex-col p-4">
                            <div className="flex text-white text-sm font-semibold mb-2">
                            {formattedDate}
                            </div>
                            <div>
                                <Table className="bg-[#3A2048] rounded-[5px]">
                                    <TableHeader className="text-white bg-[#5A3D6A]">
                                        <TableRow className="border-transparent rounded-lg text-xs">
                                            <TableHead className="w-[100px] text-white p-2 rounded-l-[5px]">Type</TableHead>
                                            <TableHead className="text-white">Assets</TableHead>                                      
                                            <TableHead className="text-white text-right rounded-r-[5px]">P/L</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="text-white font-semibold border-none">
                                        {transactionList.filter(transaction => transaction.date === tx.date).map((transaction, tIndex) => (
                                            <TableRow key={tIndex} className="border-none">
                                                <TableCell className="font-medium text-xs">
                                                <div className="flex items-center relative">
                                                    <div className="relative mr-2">
                                                        <img src={transaction.typeicon} className="h-8 w-8" alt="type icon" />
                                                        <img src={transaction.chainlogo} className="h-4 w-4 absolute bottom-0 right-0" alt="chain logo" />
                                                    </div>
                                                    <span className="text-xs">{transaction.type}</span>
                                                </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-left ">
                                                    <div className="flex justify-start ">
                                                        <img src={transaction.tokenlogo} className="h-6 w-6 " alt="token logo" />
                                                        <div className="flex flex-col ml-2">
                                                            <span className="font-bold text-white text-sm">{transaction.amounttoken}</span>
                                                            <div className="flex flex-row text-xs">
                                                                <span className="font-medium text-white/80">{transaction.amountusd}</span>
                                                                <span className="font-light text-white/60">{transaction.currentprice}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right text-xs">
                                                    {/* Here you would typically calculate P&L, but since current price isn't dynamically updated, we'll just show the amount in USD */}
                                                    <div className="flex flex-col text-right">
                                                        <span>{transaction.amountusd}</span>
                                                        {/* P&L calculation would go here if real-time data were available */}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    );
                }
                return null; // This line ensures we don't render duplicate date headers
            })}
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