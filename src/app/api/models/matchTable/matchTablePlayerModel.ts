import { PoolConnection } from "mysql2/promise";
import { dbPool } from "../../helpers/db-helper";
import { MatchTablePlayerEntity } from "@/types/entity/matchTablePlayer";
import { MatchTablePlayerCreate } from "../../interfaces/matchTable/matchTablePlayer";

/**
 * プレイヤー作成
 * @param data
 * @param dbConnection
 * @returns
 */
export async function create(
  data: MatchTablePlayerCreate,
  dbConnection: PoolConnection
): Promise<number> {
  const result: [any, any] = await dbConnection.query(
    "INSERT INTO matchTablePlayer (name, match_id) values (?, ?)",
    [data.name, data.match_id]
  );

  return result[0].insertId;
}

/**
 * 大会参加プレイヤー取得
 * @param match_id
 * @returns
 */
export async function get(match_id: string): Promise<MatchTablePlayerEntity[]> {
  const result: [any, any] = await dbPool.query(
    "SELECT * FROM matchTablePlayer WHERE matchTablePlayer.match_id = ?",
    [match_id]
  );

  if (result[0].length == 0) {
    throw new Error("大会参加プレイヤーが見つかりませんでした。");
  }

  const recodes: MatchTablePlayerEntity[] = result[0];
  return recodes;
}
