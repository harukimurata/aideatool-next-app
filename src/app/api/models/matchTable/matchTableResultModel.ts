import { PoolConnection } from "mysql2/promise";
import { dbPool } from "../../helpers/db-helper";
import { MatchTableResultEntity } from "@/types/entity/matchTableResult";
import {
  MatchTableResultCreate,
  MatchTableResultUpdate,
} from "../../interfaces/matchTable/matchTableResult";
import { NotFoundError } from "../../interfaces/my-error";

/**
 * 対戦結果作成
 * @param data
 * @param dbConnection
 * @returns
 */
export async function create(
  data: MatchTableResultCreate,
  dbConnection: PoolConnection
): Promise<number> {
  const result: [any, any] = await dbConnection.query(
    "INSERT INTO matchTableResult (playerA_id, playerB_id, result, match_id) values (?, ?, ?, ?)",
    [data.playerA_id, data.playerB_id, data.result, data.match_id]
  );

  return result[0].insertId;
}

/**
 * 対戦結果取得
 * @param match_id
 * @returns
 */
export async function get(match_id: string): Promise<MatchTableResultEntity[]> {
  const result: [any, any] = await dbPool.query(
    "SELECT * FROM matchTableResult WHERE matchTableResult.match_id = ?",
    [match_id]
  );

  if (result[0].length == 0) {
    throw new Error("対戦結果が見つかりませんでした。");
  }

  const recodes: MatchTableResultEntity[] = result[0];
  return recodes;
}

/**
 * 対戦結果更新
 * @param matchTableResultId
 * @param matchResult
 * @param dbConnection
 */
export async function update(
  data: MatchTableResultUpdate,
  dbConnection: PoolConnection
): Promise<void> {
  const result: [any, any] = await dbConnection.query(
    "UPDATE matchTableResult SET result = ELT(FIELD(id, ?), ?)  WHERE id IN (?)",
    [data.matchTableResultId, data.matchResult, data.matchTableResultId]
  );

  if (result[0].affectedRows === 0) {
    throw new NotFoundError();
  }
}
