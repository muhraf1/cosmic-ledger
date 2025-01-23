import React from "react";
import { useWalletContext } from "./WalletContext";
import { useQuery, gql } from '@apollo/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";
import { Separator } from "./separator";

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

const TRANSACTION_TABLE_DATA = gql`
  query GetTransactionTableData($address: String!) {
    transactionTableData(address: $address) {
      status
      txHash
      block
      confirmationTime
      from
      to
      function
      txFee
    }
  }
`;

function AddressDetails() {
  const { selectedWalletAddress } = useWalletContext();
  const address = selectedWalletAddress;

  const { loading: scrapedLoading, error: scrapedError, data: scrapedData } = useQuery(SCRAPED_TABLE_DATA, {
    variables: { address },
    skip: !address
  });

  const { loading: transactionLoading, error: transactionError, data: transactionData } = useQuery(TRANSACTION_TABLE_DATA, {
    variables: { address },
    skip: !address
  });

  if (scrapedLoading || transactionLoading) return <p>Loading...</p>;
  if (scrapedError || transactionError) return <p>Error :(</p>;

  const handleRowClick = (txHash) => {
    window.open(`https://suprascan.io/tx/${txHash}`, '_blank');
  };

  return (
    <div className="bg-transparent rounded-md">
      <div className="flex flex-col space-y-4">

        {/* Transaction Data */}
        <div>
          <h2 className="text-white text-lg font-bold mb-2">Transaction Data</h2>
          <Table className="bg-[#3A2048] rounded-[5px]">
            <TableHeader className="text-white bg-[#5A3D6A]">
              <TableRow className="border-transparent rounded-lg text-xs">
                <TableHead className="text-white">Tx Hash</TableHead>
                <TableHead className="text-white">From</TableHead>
                <TableHead className="text-white">To</TableHead>
                <TableHead className="text-white">Function</TableHead>
                <TableHead className="text-white">Tx Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-white font-semibold">
              {transactionData.transactionTableData.length > 0 ? (
                transactionData.transactionTableData.map((tx, index) => (
                  <TableRow 
                    key={index} 
                    className="border-none cursor-pointer hover:bg-[#4A315A]"
                    onClick={() => handleRowClick(tx.txHash)}
                  >
                    <TableCell className="text-xs">{tx.txHash}</TableCell>
                    <TableCell className="text-xs">{tx.from.slice(0, 10)}...</TableCell>
                    <TableCell className="text-xs">{tx.to.slice(0, 10)}...</TableCell>
                    <TableCell className="text-xs">{tx.function}</TableCell>
                    <TableCell className="text-xs">{tx.txFee}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-xs">
                     Currently only support Supra address history.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

      </div>
    </div>
  );
}

export default AddressDetails;