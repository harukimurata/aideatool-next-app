export interface MatchTableOrderCreate {
  playerA_id: number;
  playerB_id: number;
  status: number;
  match_id: string;
}

export interface MatchTableOrderUpdate {
  matchTableOrderId: number[];
  status: number[];
}
