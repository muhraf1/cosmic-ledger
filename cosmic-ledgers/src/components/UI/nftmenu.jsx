import React, { useState, useEffect } from "react";
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Separator } from "./separator";
import { Input } from "@/components/ui/input";
import GridSwitch from "./GridSwitch";
import WalletProvider, { useWalletContext } from "./WalletContext";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

// GraphQL Query
const GET_NFT_HOLDINGS = gql`
 query NftHoldings($address: String!) {
  nftHoldings(address: $address) {
    owner
    nativeToken {
      name
      cmcId
      cmc_slug
      cgId
      symbol
      decimals
    }
    collection {
      description
      externalUrl
      id
      imageUrl
      name
      totalItems
      chain
      verified
      scam
    }
    collectionId
    tokens {
      royalty
      imageUrl
      tokenId
      contractAddress
      name
      rarityScore
      rank
      price
      cost
    }
    floorPrice
    marketPrice
    profit {
      realizedPnL
      unrealizedPnL
    }
  }
}
`;

    const NftMenu = () => {
        const [activeSection, setActiveSection] = useState("All");
        const { wallets, selectedWalletAddress } = useWalletContext();
        useEffect(() => {
            if (selectedWalletAddress === null) { // 'All Wallet' is selected
              const fetchAllHoldings = async () => {
                const allHoldings = [];
                for (const wallet of wallets) {
                  const { data } = await useQuery(GET_NFT_HOLDINGS, { variables: { address: wallet.address } });
                  if (data?.walletHoldings) {
                    allHoldings.push(...data.walletHoldings);
                  }
                }
                setAllHoldings(allHoldings);
              };
              fetchAllHoldings();
            }
          }, [selectedWalletAddress, wallets]);
      
      
        const address = selectedWalletAddress; // Use the selected wallet's address
        console.log('Address used for query:', address);

        const { loading, error, data } = useQuery(GET_NFT_HOLDINGS, {
            variables: { address },
            // You might want to skip this query if the address is not set
            skip: !address,
          });
          console.log("nft data",data);
        
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

        const nftData = {
            "All": [
                { chainlogo: "./src/assets/eth_logo.png", nftname: "#145", authorname: "Pudgy Penguins", amount: "22.3 ETH", nftimage: "./src/assets/pudgy_nft.png" },
                { chainlogo: "./src/assets/solana_logo.png", nftname: "#3046", authorname: "Mads Lads", amount: "81,77 SOL", nftimage: "./src/assets/madslads_nft.png" },
                { chainlogo: "./src/assets/sui_logo.png", nftname: "RootLet#3068", authorname: "Rootlets", amount: "2,484", nftimage: "./src/assets/rootlets_nft.png" },

            ],
            "EVM": [
                { chainlogo: "./src/assets/eth_logo.png", nftname: "#145", authorname: "Pudgy Penguins", amount: "22.3 ETH", nftimage: "./src/assets/pudgy_nft.png" },
            ],
            "SVM": [
                { chainlogo: "./src/assets/solana_logo.png", nftname: "#3046", authorname: "Mads Lads", amount: "81,77 SOL", nftimage: "./src/assets/madslads_nft.png" },
            ],
            "Move": [
                { chainlogo: "./src/assets/sui_logo.png", nftname: "RootLet#3068", authorname: "Rootlets", amount: "2,484", nftimage: "./src/assets/rootlets_nft.png" },
            ]

        }

        const renderNftCards = () => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            if (!data || !data.nftHoldings) return <p>No NFT data available</p>;
        
            return (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {data.nftHoldings.map((holding, index) => (
                  holding.tokens.map((token, i) => (
                    <Dialog key={`${index}-${i}`}>
                      <DialogTrigger asChild>
                        <div className="text-left rounded-lg bg-[#D9D9D9]/5 border border-white/10 bottom-2 cursor-pointer">
                          <img src={token.imageUrl} alt={token.name} className="w-full h-fit object-cover mb-2" />
                          <div className="px-2 py-2">
                            <div className="text-sm font-bold text-white">{token.name}</div>
                            <div className="text-xs font-medium text-white/70">{holding.collection.name}</div>
                            <div className="text-sm font-semibold text-white">{token.amount}</div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-fit h-auto">
                        <DialogHeader className="flex flex-col items-center">
                          <DialogTitle>{token.name}</DialogTitle>
                          <DialogDescription className="text-center">
                            <p>{holding.collection.name}</p>
                            <p>{token.amount}</p>
                            <img 
                              src={token.imageUrl} 
                              alt={token.name} 
                              className="w-full object-cover mt-2" 
                              style={{ maxHeight: '70vh' }}  
                            />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  ))
                ))}
              </div>
            );
          };

        const renderSectionContent = () => {
            const data = chainData[activeSection] || [];
            const nftList = nftData[activeSection] || [];



            switch (activeSection) {
                case "All":
                case "EVM":
                case "SVM":
                case "Move":
                    return (
                        // column
                        <div className="flex flex-col">
                            {/* section chain */}
                            {/* <div className="flex flex-row space-x-4">
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

                            </div> */}


                            {/* detailed nft  */}
                            <div className="w-full flex text-white text-xs font-bold justify-end">
                            <span>Total Items: {nftList.length}</span>
                            </div>
                            <Separator className="mt-3 bg-white/10"></Separator>
                            {/* filters price, listed & not listed, search bar and button display grid vs list  */}
                            <div className="flex flex-row justify-between items-center gap-2">
                                <div className="flex items-center gap-2">
                                    {/* Filters for price */}
                                    <div className="flex">
                                        <Select className="p-0">
                                            <SelectTrigger className="w-[150px] bg-white/5 text-white border-white/10 text-[8px] mt-2 font-medium">
                                                <SelectValue placeholder="Recently Received" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white/10 border-white/10 backdrop-blur-md font-semibold">
                                                <SelectGroup>
                                                    <SelectItem value="Recently Received" className="text-white">
                                                        Recently Received
                                                    </SelectItem>
                                                    <SelectItem value="Price: High to Low" className="text-white">
                                                        Price: High to Low
                                                    </SelectItem>
                                                    <SelectItem value="Price: Low to High" className="text-white">
                                                        Price: Low to High
                                                    </SelectItem>
                                                    <SelectItem value="Recently Listed" className="text-white">
                                                        Recently Listed
                                                    </SelectItem>
                                                    <SelectItem value="Common to Rare" className="text-white">
                                                        Common to Rare
                                                    </SelectItem>
                                                    <SelectItem value="Rare to Common" className="text-white">
                                                        Rare to Common
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Listed & Non-listed */}
                                    <div className="flex">
                                        <Select>
                                            <SelectTrigger className="w-[80px] bg-white/5 text-white border-white/10 text-[9px] mt-2 font-medium">
                                                <SelectValue placeholder="All" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white/10 border-white/10 backdrop-blur-md font-semibold">
                                                <SelectGroup>
                                                    <SelectItem value="All" className="text-white">
                                                        All
                                                    </SelectItem>
                                                    <SelectItem value="Listed" className="text-white">
                                                        Listed
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Button display grid and list */}
                                <div className="flex justify-center	 items-center">
                                    <GridSwitch
                                        onSwitch={(type) => {
                                            // Handle the chart type change
                                            console.log(`Switched to ${type} chart`);
                                        }}
                                        defaultType="bar"
                                    />
                                </div>
                            </div>

                            {/* NFT sections */}
                            {/*  2 grids  1row have 2 nft cards when excced creare new row */}
                    
                            {renderNftCards()}


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

    export default NftMenu;