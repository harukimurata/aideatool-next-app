export interface MatchTableResultCreate {
  playerA_id: number;
  playerB_id: number;
  result: number;
  match_id: string;
}

export interface MatchTableResultUpdate {
  matchTableResultId: number[];
  matchResult: number[];
}
