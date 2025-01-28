// schema.js
import { gql } from 'apollo-server-express';

  const typeDefs = gql`


  type Price {
    price: Float!
    symbol: String
    decimal: Int!
    source: String!
  }

  type Last24hPrice {
    symbol: String!
    price: Float
    timestamp: Int
    confidence: Float
    source: String
  }

  type WalletHolding {
    owner: String!
    cmc_id: Int
    cg_id: String
    cmc_slug: String
    name: String!
    symbol: String!
    logo: String!
    amount: String!
    amountRaw: String!
    balance: String!
    contractAddress: String!
    contractDecimals: Int!
    rate: Float!
    price: Price!
    last_24h_price: Last24hPrice
    avgCost: Float!
    last_transferred_at: String
    positionId: String!
    category: String!
    sector: String!
    rank: String!
    positionType: String!
    chain: String!
    is_spam: Boolean!
  }

  type NativeToken {
      name: String!
      cmcId: Int!
      cmc_slug: String!
      cgId: String!
      symbol: String!
      decimals: Int!
    }

    type Collection {
      description: String
      externalUrl: String
      id: String!
      imageUrl: String
      name: String
      totalItems: Int
      chain: String
      verified: Boolean
      scam: Boolean
    }

    type Token {
      royalty: Int!
      imageUrl: String!
      tokenId: String!
      contractAddress: String!
      name: String
      rarityScore: Int!
      rank: String!
      price: Float!
      cost: Float!
    }

    type Profit {
      realizedPnL: Float!
      unrealizedPnL: Float!
    }

    type NFTHolding {
      owner: String!
      nativeToken: NativeToken!
      collection: Collection!
      collectionId: String!
      tokens: [Token!]!
      floorPrice: Float!
      marketPrice: Float!
      profit: Profit!
    }


  type ScrapedRowTokens {
    name: String!
    symbol: String!
    amount: String!
    price: String!
    value: String!
  }

  type TransactionRow {
    status: String
    txHash: String!
    block: String!
    confirmationTime: String!
    from: String!
    to: String!
    function: String!
    txFee: String!
  }


  type SupraPrice {
      price: Float
      timestamp: String
  }

  type PriceData {
      time: String
      timestamp: String
      open: String
      high: String
      low: String
      close: String
    }

    type NetWorthPerformance {
    date: String
    netWorth: String
}

  type Query {
    walletHoldings(address: String!): [WalletHolding!]!
    nftHoldings(address: String!): [NFTHolding!]!
    scrapedTableData(address: String!): [ScrapedRowTokens!]!
    transactionTableData(address: String!): [TransactionRow!]!
    getSupraPrice: SupraPrice
    getPriceHistory(trading_pair: String, startDate:String , endDate:String, interval:String): [PriceData!]!
    getNetWorthPerformance(address: String!, startDate: String!, endDate: String!): [NetWorthPerformance!]!
    getPriceHistoryDialog(trading_pair: String, startDate:String , endDate:String, interval:String): [PriceData!]!
  }

`;

export { typeDefs };