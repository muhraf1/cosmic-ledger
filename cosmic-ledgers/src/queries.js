/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const walletHoldings = /* GraphQL */ `
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
        __typename
      }
      last_24h_price {
        symbol
        price
        timestamp
        confidence
        source
        __typename
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
      __typename
    }
  }
`;
export const nftHoldings = /* GraphQL */ `
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
        __typename
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
        __typename
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
        __typename
      }
      floorPrice
      marketPrice
      profit {
        realizedPnL
        unrealizedPnL
        __typename
      }
      __typename
    }
  }
`;
export const scrapedTableData = /* GraphQL */ `
  query ScrapedTableData($address: String!) {
    scrapedTableData(address: $address) {
      name
      symbol
      amount
      price
      value
      __typename
    }
  }
`;
export const transactionTableData = /* GraphQL */ `
  query TransactionTableData($address: String!) {
    transactionTableData(address: $address) {
      status
      txHash
      block
      confirmationTime
      from
      to
      function
      txFee
      __typename
    }
  }
`;
export const getSupraPrice = /* GraphQL */ `
  query GetSupraPrice {
    getSupraPrice {
      price
      timestamp
      __typename
    }
  }
`;
export const getPriceHistory = /* GraphQL */ `
  query GetPriceHistory(
    $trading_pair: String
    $startDate: String
    $endDate: String
    $interval: String
  ) {
    getPriceHistory(
      trading_pair: $trading_pair
      startDate: $startDate
      endDate: $endDate
      interval: $interval
    ) {
      time
      timestamp
      open
      high
      low
      close
      __typename
    }
  }
`;
