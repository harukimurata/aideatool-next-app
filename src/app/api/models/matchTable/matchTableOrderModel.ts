import { PoolConnection } from "mysql2/promise";
import { dbPool } from "../../helpers/db-helper";
import { MatchTableOrderEntity } from "@/types/entity/matchTableOrder";
import {
  MatchTableOrderCreate,
  MatchTableOrderUpdate,
} from "../../interfaces/matchTable/matchTableOrder";
import { NotFoundError } from "../../interfaces/my-error";

/**
 * 対戦カード作成
 * @param data
 * @param dbConnection
 * @returns
 */
export async function create(
  data: MatchTableOrderCreate,
  dbConnection: PoolConnection
): Promise<number> {
  const result: [any, any] = await dbConnection.query(
    "INSERT INTO matchTableOrder (playerA_id, playerB_id, status, match_id) values (?, ?, ?, ?)",
    [data.playerA_id, data.playerB_id, data.status, data.match_id]
  );

  return result[0].insertId;
}

/**
 * 対戦カード取得
 * @param match_id
 * @returns
 */
export async function get(match_id: string): Promise<MatchTableOrderEntity[]> {
  const result: [any, any] = await dbPool.query(
    "SELECT * FROM matchTableOrder WHERE matchTableOrder.match_id = ?",
    [match_id]
  );

  if (result[0].length == 0) {
    throw new Error("大会参加プレイヤーが見つかりませんでした。");
  }

  const recodes: MatchTableOrderEntity[] = result[0];
  return recodes;
}

/**
 * 対戦カード更新
 * @param matchTableOrderId
 * @param status
 * @param dbConnection
 */
export async function update(
  data: MatchTableOrderUpdate,
  dbConnection: PoolConnection
): Promise<void> {
  const result: [any, any] = await dbConnection.query(
    "UPDATE matchTableOrder SET status = ELT(FIELD(id, ?), ?)  WHERE id IN (?)",
    [data.matchTableOrderId, data.status, data.matchTableOrderId]
  );

  if (result[0].affectedRows === 0) {
    throw new NotFoundError();
  }
}
