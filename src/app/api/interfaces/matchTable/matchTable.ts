import { MatchTableResponseEntity } from "@/types/entity/matchTable";
import { MatchTablePlayerEntity } from "@/types/entity/matchTablePlayer";
import { MatchTableOrderEntity } from "@/types/entity/matchTableOrder";
import { MatchTableResultEntity } from "@/types/entity/matchTableResult";

export interface MathTableGetRequest {
  match_id: string;
  password: string;
}

export interface MathTableAuthCheckRequest {
  match_id: string;
  auth_password: string;
}

export interface MatchTableCreateRequest {
  title: string;
  match_id: string;
  password: string;
  auth_password?: string;
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
