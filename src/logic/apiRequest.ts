import axios from "axios";
import {
  type MatchTableCreateRequest,
  type MathTableGetRequest,
  type MatchTableData,
  type MatchTableUpdateRequest,
} from "../types/MatchTable";
const API_URL = process.env.NEXT_PUBLIC_API;
const MATCH_TABLE_API_URL = API_URL + "matchTable";

/**
 * 大会情報取得
 * @param data
 * @returns
 */
export async function getMatchTable(
  data: MathTableGetRequest
): Promise<MatchTableData> {
  const result = await axios.post(`${MATCH_TABLE_API_URL}/get`, data);
  return result.data;
}

/**
 * 大会情報作成
 * @param data
 * @returns
 */
export async function createMatchTable(
  data: MatchTableCreateRequest
): Promise<any> {
  const result = await axios.post(`${MATCH_TABLE_API_URL}/create`, data);
  return result.data;
}

/**
 * 大会情報更新
 * @param data
 * @returns
 */
export async function updateMatchTable(
  data: MatchTableUpdateRequest
): Promise<any> {
  const result = await axios.post(`${MATCH_TABLE_API_URL}/update`, data);
  return result.data;
}
