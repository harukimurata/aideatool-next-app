import { type MatchTableResponseEntity } from "./entity/matchTable";
import { type MatchTablePlayerEntity } from "./entity/matchTablePlayer";
import { type MatchTableOrderEntity } from "./entity/matchTableOrder";
import { type MatchTableResultEntity } from "./entity/matchTableResult";

export interface MathTableGetRequest {
  match_id: string;
  password: string;
}

export interface MatchTableCreateRequest {
  title: string;
  match_id: string;
  password: string;
  auth_password: string | null;
  player: string[];
}

export interface MatchTableCreate {
  title: string;
  match_id: string;
  password: string;
  auth_password?: string;
}

export type MatchTableData = {
  matchTable: MatchTableResponseEntity;
  matchTablePlayer: MatchTablePlayerEntity[];
  matchTableOrder: MatchTableOrderEntity[];
  matchTableResult: MatchTableResultEntity[];
};

export interface MatchTableUpdateRequest {
  match_id: string;
  auth_password: string | null;
  matchTableOrder: MatchTableOrderEntity[];
  matchTableResult: MatchTableResultEntity[];
}
