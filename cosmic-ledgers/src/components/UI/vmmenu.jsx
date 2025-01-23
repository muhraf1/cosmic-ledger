import React, { useState, useEffect } from "react";
import { Separator } from "./separator";
import { useQuery, gql } from '@apollo/client'; // Assuming Apollo Client is set up in your project
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table"; // Assuming you're using a UI component library like Radix UI for tables
import WalletProvider, { useWalletContext } from "./WalletContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
// Define the GraphQL query for fetching wallet holdings
const GET_WALLET_HOLDINGS = gql`
 query WalletHoldings($address: String!) {
  walletHoldings(address: $address) {
    owner
    cmc_id
    cg_id
    cmc_slug
    name
    symbol
    logo
    amount
    amountRaw
    balance
    contractAddress
    contractDecimals
    rate
    price {
      price
      symbol
      decimal
      source
    }
    last_24h_price {
      symbol
      price
      timestamp
      confidence
      source
    }
    avgCost
    last_transferred_at
    positionId
    category
    sector
    rank
    positionType
    chain
    is_spam
  }
}
`;

const SCRAPED_TABLE_DATA = gql`
    query GetScrapedTableData($address: String!) {
        scrapedTableData(address: $address) {
            name
            symbol
            amount
            price
            value
        }
    }
`;

const GET_SUPRA_PRICE = gql`
    query GetSupraPrice {
        getSupraPrice {
            price
            timestamp
        }
    }
`;



const VmMenu = () => {
    const [activeSection, setActiveSection] = useState("All");
    const { wallets, selectedWalletAddress } = useWalletContext();
    const [allHoldings, setAllHoldings] = useState([]);
    const { loading: priceLoading, error: priceError, data: priceData } = useQuery(GET_SUPRA_PRICE);



    useEffect(() => {
        if (selectedWalletAddress === null) { // 'All Wallet' is selected
            const fetchAllHoldings = async () => {
                const allHoldings = [];
                for (const wallet of wallets) {
                    const { data } = await useQuery(GET_WALLET_HOLDINGS, { variables: { address: wallet.address } });
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

    // Determine which query to use based on the selected wallet's chain
    const selectedWallet = wallets.find(wallet => wallet.address === selectedWalletAddress);
    const query = selectedWallet?.chain === 'supra' ? SCRAPED_TABLE_DATA : GET_WALLET_HOLDINGS;


    const { loading, error, data } = useQuery(query, {
        variables: { address: address },
        skip: !address // Skip the query if no address is provided
    });

    // const { loading, error, data } = useQuery(GET_WALLET_HOLDINGS, {
    //     variables: { address: address },
    //     skip: !address // Skip the query if no address is provided
    // });

    console.log("fetcing data", data);
    // Sections array
    // Sections array
    const sections = ["All", "EVM", "SVM", "Move"];


    // Helper function to categorize holdings by chain
    const categorizeHoldings = (holdings) => {
        return holdings.reduce((acc, holding) => {
            const chain = holding.chain || 'Unknown'; // Fallback if chain is not provided
            if (!acc[chain]) acc[chain] = [];
            acc[chain].push(holding);
            return acc;
        }, { All: holdings });
    };


    const calculateTotalBalance = (holdings) => {
        let total = 0;
        // Assuming 'holdings' is directly the array of holding objects for an address
        holdings.forEach(holding => {
            // Convert the amount to a number and multiply by price
            const amount = parseFloat(holding.amountRaw) * holding.price.price;
            if (!isNaN(amount)) {
                total += amount;
            }
        });
        return total;
    };

    const totalBalance = calculateTotalBalance(data?.walletHoldings || data?.scrapedTableData || []);
    // Use effect to process data when it changes

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

    const protocolData = {
        "All": [
            {
                protocollogo: "./src/assets/wallet_logo.png", protocolname: "Wallet", amount: "$5,000", token: [
                    { ticker: "Sup", tickerlogo: "./src/assets/supra_logo.png", price: "$1", Amount: "2500", USDvalue: "$1500" },
                    { ticker: "ETH", tickerlogo: "./src/assets/eth_logo.png", price: "$3000", Amount: "0.43", USDvalue: "$1300" },
                    { ticker: "WIF", tickerlogo: "./src/assets/wif_logo.png", price: "$1", Amount: "200", USDvalue: "$200" },
                    { ticker: "SOL", tickerlogo: "./src/assets/solana_logo.png", price: "$190", Amount: "5,26", USDvalue: "$1000" },
                    { ticker: "SUI", tickerlogo: "./src/assets/sui_logo.png", price: "$4,52", Amount: "221,2", USDvalue: "$1000" },


                ]
            },
            {
                protocollogo: "./src/assets/supra_logo.png", protocolname: "Delegation Pool 0", amount: "$3,500", token: [
                    { ticker: "Sup", tickerlogo: "./src/assets/supra_logo.png", price: "3300 SUP", Amount: "200 SUP", USDvalue: "$3500" },

                ]
            },
            {
                protocollogo: "./src/assets/aave_logo.png", protocolname: "AAVE", amount: "$700", token: [
                    { ticker: "USDC Bridged + ETH", tickerlogo: "./src/assets/usdc_eth_logo.png", price: "600 USDC +0,03 ETH", Amount: "3 USDC 0.00015 ETH", USDvalue: "$704" },

                ]
            },
            {
                protocollogo: "./src/assets/orca_logo.png", protocolname: "ORCA", amount: "$800", token: [
                    { ticker: "JUP + SOLANA", tickerlogo: "./src/assets/jup_sol_logo.png", price: "3 SOL 28,75 JUP", Amount: "0,0024 SOL 2,3 JUP", USDvalue: "$803" },

                ]
            },

        ],
        "EVM": [
            {
                protocollogo: "./src/assets/wallet_logo.png", protocolname: "Wallet", amount: "$1,300", token: [
                    { ticker: "ETH", tickerlogo: "./src/assets/eth_logo.png", price: "$3000", Amount: "0.43", USDvalue: "$1300" },

                ]
            },

            {
                protocollogo: "./src/assets/aave_logo.png", protocolname: "AAVE", amount: "$700", token: [
                    { ticker: "USDC Bridged + ETH", tickerlogo: "./src/assets/usdc_eth_logo.png", price: "600 USDC +0,03 ETH", Amount: "3 USDC 0.00015 ETH", USDvalue: "$704" },

                ]
            },

        ],
        "SVM": [
            {
                protocollogo: "./src/assets/wallet_logo.png", protocolname: "Wallet", amount: "$2,000", token: [
                    { ticker: "WIF", tickerlogo: "./src/assets/wif_logo.png", price: "$1", Amount: "200", USDvalue: "$200" },
                    { ticker: "SOL", tickerlogo: "./src/assets/solana_logo.png", price: "$190", Amount: "5,26", USDvalue: "$1000" },

                ]
            },
            {
                protocollogo: "./src/assets/orca_logo.png", protocolname: "ORCA", amount: "$800", token: [
                    { ticker: "JUP + SOLANA", tickerlogo: "./src/assets/jup_sol_logo.png", price: "3 SOL 28,75 JUP", Amount: "0,0024 SOL 2,3 JUP", USDvalue: "$803" },

                ]
            }
        ],
        "Move": [
            {
                protocollogo: "./src/assets/wallet_logo.png", protocolname: "Wallet", amount: "$1,000", token: [
                    { ticker: "SUI", tickerlogo: "./src/assets/sui_logo.png", price: "$4,52", Amount: "221,2", USDvalue: "$1000" }
                ]
            }
        ]
    };

    const renderSectionContent = () => {
        if (loading || priceLoading) return <p>Loading...</p>;
        if (error || priceError) return <p>Error: {(error || priceError).message}</p>;

        // const data = chainData[activeSection] || [];
        // const dataprotocol = protocolData[activeSection] || [];
        // Determine the data format based on which query was used
        let holdings = selectedWallet?.chain === 'supra' ? data?.scrapedTableData : data?.walletHoldings;
        if (!holdings) {
            return <p>No data available for this address.</p>;
        }

        const sectionHoldings = holdings.filter(holding =>
            activeSection === "All" || (holding.chain === activeSection || activeSection === 'All')
        );

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
                            {sectionHoldings.map((holding, index) => (
                                <div key={index} className="flex flex-row p-4">
                                    <div className="flex space-x-1 w-full ">
                                        <img
                                            src={holding.logo}
                                            alt={holding.name}
                                            className="h-8 w-8 mr-2"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white/60 text-sm text-left">{holding.name}</span>
                                            <div className="flex flex-row justify-center items-center">
                                                <span className="font-bold text-white text-sm">{`$${holding.balance}`}</span>
                                                <span className="font-medium text-white/60 text-xs ml-2">{`${((holding.balance / totalBalance) * 100).toFixed(2)}%`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div> */}
                        {/* section protocol & wallet  */}

                        {/* <div className="flex flex-row space-x-2 ml-4 ">
                            {dataprotocol.map((protocol, index) => (
                                <div key={index} className="flex flex-row ">
                                    <div className="flex flex-row w-full bg-[#4B2D68] p-2 rounded-[3px] ">
                                        <img
                                            src={protocol.protocollogo}
                                            alt={protocol.protocolname}
                                            className="h-6 w-6 mr-2"
                                        />
                                        <div className="flex flex-col justify-start w-full max-w-[50px]">
                                            <span className="font-medium text-white/60 text-xs text-left truncate">{protocol.protocolname}</span>
                                            <div className="flex flex-row justify-start">
                                                <span className="font-bold text-white text-xs text-left">{protocol.amount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div> */}

                        {/* Token Tables */}
                        <div className="flex flex-col space-y-2">
                            <Table className="bg-[#3A2048] rounded-[5px]">
                                <TableHeader className="text-white bg-[#5A3D6A] ">
                                    <TableRow className="border-transparent rounded-lg text-xs">
                                        <TableHead className="w-[100px] text-white p-2 rounded-l-[5px]">Token</TableHead>
                                        <TableHead className=" text-white">Price</TableHead>
                                        <TableHead className=" text-white">Amount</TableHead>
                                        <TableHead className=" text-white text-right rounded-r-[5px]">USD Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-white font-semibold border-none">
                                    {sectionHoldings.map((holding, index) => (
                                        <Dialog key={holding.name || index}>
                                            <DialogTrigger asChild>
                                                <TableRow className="border-none cursor-pointer hover:bg-[#5A3D6A]">
                                                    <TableCell className="font-medium text-xs">
                                                        <div className="flex items-center">
                                                            {selectedWallet?.chain === 'supra'
                                                                ? <img src="./src/assets/supra_logo.png" alt="Supra" className="h-6 w-6 mr-2" />
                                                                : (selectedWallet?.chain !== 'supra' && holding.logo &&
                                                                    <img src={holding.logo} alt={holding.symbol} className="h-6 w-6 mr-2" />
                                                                )
                                                            }
                                                            <span className="text-xs">{holding.symbol || "N/A"}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {selectedWallet?.chain === 'supra' ?
                                                            `$${priceData?.getSupraPrice?.price?.toFixed(5) || "N/A"}` :
                                                            (holding.price?.price ? `$${holding.price.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A")
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {holding.amount ? holding.amount.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "N/A"}
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs">
                                                        {holding.price && holding.amount ? `$${(
                                                            parseFloat(
                                                                selectedWallet?.chain === 'supra'
                                                                    ? holding.amount.replace(/,/g, '')
                                                                    : holding.amount
                                                            ) * (selectedWallet?.chain === 'supra' ? priceData?.getSupraPrice?.price : holding.price.price)
                                                        ).toLocaleString('en-US', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 3
                                                        })}` : "N/A"}
                                                    </TableCell>
                                                </TableRow>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>{holding.name}</DialogTitle>
                                                    <DialogDescription>
                                                        Symbol: {holding.symbol}<br />
                                                        Price: ${selectedWallet?.chain === 'supra' ? priceData?.getSupraPrice?.price?.toFixed(5) : holding.price?.price || "N/A"}<br />
                                                        Amount: {holding.amount || "N/A"}<br />
                                                        USD Value: {holding.value || (parseFloat(holding.amount || 0) * (selectedWallet?.chain === 'supra' ? priceData?.getSupraPrice?.price : holding.price?.price || 0)).toFixed(2)}
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </TableBody>
                            </Table>
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

export default VmMenu;