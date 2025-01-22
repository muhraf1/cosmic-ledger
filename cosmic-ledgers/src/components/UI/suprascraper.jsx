import React from "react";
import { useWalletContext } from "./WalletContext";
import { useQuery, gql } from '@apollo/client'; // Assuming Apollo Client is set up in your project



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
     // Scraped Table Data
     const { selectedWalletAddress } = useWalletContext();


     const address = selectedWalletAddress; // Use the selected wallet's address

  const { loading: scrapedLoading, error: scrapedError, data: scrapedData } = useQuery(SCRAPED_TABLE_DATA, {
    variables: { address: address },
    skip: !address // Skip the query if no address is provided
  });
  console.log("check address",address);
  // Transaction Table Data
  const { loading: transactionLoading, error: transactionError, data: transactionData } = useQuery(TRANSACTION_TABLE_DATA, {
    variables: { address: address },
    skip: !address // Skip the query if no address is provided
  });

  if (scrapedLoading || transactionLoading) return <p>Loading...</p>;
  if (scrapedError || transactionError) return <p>Error :(</p>;


    return (
<div>
<h2>Scraped Table Data</h2>
      <ul>{scrapedData.scrapedTableData.map(s => <li key={s.name}>{s.name} - {s.symbol} - {s.amount}</li>)}</ul>

      <h2>Transaction Data</h2>
      <ul>{transactionData.transactionTableData.map(t => (
        <li key={t.txHash}>
          {t.status} - {t.txHash.slice(0, 10)}... - From: {t.from.slice(0, 10)}... To: {t.to.slice(0, 10)}...
        </li>
      ))}</ul>
    </div>
    );
}

export default AddressDetails;
