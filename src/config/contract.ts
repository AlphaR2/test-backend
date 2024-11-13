export const CONTRACT_CONFIG = {
  contractAddress: process.env.CONTRACT_ADDRESS!,
  rpcEndpoint: "https://kujira-testnet-rpc.polkachu.com",
  mnemonic: process.env.ADMIN_MNEMONIC!,
  denom: "ukuji",
  fee: {
    amount: "2500",
    gas: "400000",
  },
} as const;

export interface GameResponse {
  id: string;
  owner: string;
  init_time: string;
  game_duration: string;
  game_start: string;
  outcome: string | null;
  total_bet_number: number;
  total_bet_amount: string;
  total_home_win_number: number;
  home_win_bets: string;
  total_away_win_number: number;
  away_win_bets: string;
  total_draw_number: number;
  draw_bets: string;
  payout_processed: boolean;
  closed: boolean;
}

export type Outcome = "HomeWin" | "AwayWin" | "Draw";
