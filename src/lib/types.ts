export interface Trade {
  buyer: string
  seller: string
  card_id: number
  card_name: string
  category: 'c' | 'u' | 'r' | 'ur' | 'e' | 'l'
  price: number
  season: 1 | 2 | 3 | 4
  timestamp: number
}

export interface TradedCount {
  rarity: 'c' | 'u' | 'r' | 'ur' | 'e' | 'l'
  count: number
}

export interface TradedSeason {
  season: 1 | 2 | 3 | 4
  count: number
}

export interface TradesData {
  buyTot: number
  sellTot: number
  earliestBuy: Trade
  earliestSell: Trade
  mostExpensiveBuy: Trade
  mostExpensiveSale: Trade
  mostTradedCategory: TradedCount
  mostTradedSeason: TradedSeason
  mostTradedCategorySold: TradedCount
  mostTradedSeasonSold: TradedSeason
}
