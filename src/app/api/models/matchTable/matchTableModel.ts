import { PoolConnection } from "mysql2/promise";
import { dbPool } from "../../helpers/db-helper";
import { MatchTableEntity } from "@/types/entity/matchTable";
import { MatchTableCreate } from "../../interfaces/matchTable/matchTable";

const ER_DUP_ENTRY = 1062;

/**
 * 大会ID使用済み判定
 * @param matchId
 * @returns
 */
export async function searchById(matchId: string): Promise<boolean> {
  const result: [any, any] = await dbPool.query(
    "SELECT * FROM matchTable WHERE match_id = ?",
    matchId
  );

  return result[0].length > 0;
}

/**
 * 大会情報作成
 * @param data
 * @returns 大会ID
 */
export async function create(
  data: MatchTableCreate,
  dbConnection: PoolConnection
): Promise<number> {
  const result: [any, any] = await dbConnection.query(
    "INSERT INTO matchTable (title, match_id, password, auth_password) values (?, ?, ?, ?)",
    [data.title, data.match_id, data.password, data.auth_password]
  );

  return result[0].insertId;
}

/**
 * 大会情報取得
 * @param match_id
 * @returns
 */
export async function get(match_id: string): Promise<MatchTableEntity> {
  const result: [any, any] = await dbPool.query(
    "SELECT * FROM matchTable WHERE matchTable.match_id = ?",
    [match_id]
  );

  if (result[0].length == 0) {
    throw new Error("大会情報が見つかりませんでした。");
  }

  const recode: MatchTableEntity = result[0][0];

  const matchTable: MatchTableEntity = {
    id: recode.id,
    title: recode.title,
    match_id: recode.match_id,
    password: recode.password,
    auth_password: recode.auth_password,
    created_at: recode.created_at,
    updated_at: recode.updated_at,
  };
  return matchTable;
}
