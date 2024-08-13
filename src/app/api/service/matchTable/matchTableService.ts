import { dbPool, transactionHelper } from "../../helpers/db-helper";
import { MatchTableResponseEntity } from "@/types/entity/matchTable";
import { MatchTableOrderEntity } from "@/types/entity/matchTableOrder";
import { MatchTableResultEntity } from "@/types/entity/matchTableResult";
import {
  MatchTableCreate,
  MatchTableCreateRequest,
  MatchTableData,
  MatchTableUpdateRequest,
  MathTableGetRequest,
  MathTableAuthCheckRequest,
} from "../../interfaces/matchTable/matchTable";
import { MatchTableOrderUpdate } from "../../interfaces/matchTable/matchTableOrder";
import { MatchTableResultUpdate } from "../../interfaces/matchTable/matchTableResult";
import { ConflictError } from "../../interfaces/my-error";
import * as MatchTableModel from "../../models/matchTable/matchTableModel";
import * as MatchTableOrderModel from "../../models/matchTable/matchTableOrderModel";
import * as MatchTablePlayerModel from "../../models/matchTable/matchTablePlayerModel";
import * as MatchTableResultModel from "../../models/matchTable/matchTableResultModel";
/**
 * 大会情報作成
 * @param data
 */
export async function create(data: MatchTableCreateRequest): Promise<void> {
  //存在チェック
  if (await MatchTableModel.searchById(data.match_id)) {
    throw new Error("既に使われているIDです。");
  }

  //大会データ
  const createMatchTableData: MatchTableCreate = {
    title: data.title,
    match_id: data.match_id,
    password: data.password,
    auth_password: data.auth_password,
  };

  //対戦者
  const players: string[] = data.player;

  //トランザクション
  const dbConnection = await dbPool.getConnection();
  try {
    await dbConnection.beginTransaction();

    //大会情報作成
    await MatchTableModel.create(createMatchTableData, dbConnection);

    //プレイヤー作成
    let playerIdList: number[] = [];
    for (const player of players) {
      const playerId = await MatchTablePlayerModel.create(
        { name: player, match_id: createMatchTableData.match_id },
        dbConnection
      );
      playerIdList.push(playerId);
    }

    //結果リスト作成
    for (let i = 0; i < playerIdList.length; i++) {
      for (let j = 0; j < playerIdList.length; j++) {
        if (j !== i) {
          await MatchTableResultModel.create(
            {
              playerA_id: playerIdList[i],
              playerB_id: playerIdList[j],
              result: 0,
              match_id: createMatchTableData.match_id,
            },
            dbConnection
          );
        }
      }
    }

    //対戦カード作成
    let stackList = [];
    for (let i = 0; i < playerIdList.length; i++) {
      for (let j = 0; j < playerIdList.length; j++) {
        if (i != j) {
          if (stackList.indexOf(j) === -1) {
            await MatchTableOrderModel.create(
              {
                playerA_id: playerIdList[i],
                playerB_id: playerIdList[j],
                status: 0,
                match_id: createMatchTableData.match_id,
              },
              dbConnection
            );
          }
        }
      }
      stackList.push(i);
    }

    await dbConnection.commit();
  } catch (e) {
    await dbConnection.rollback();
    if (e instanceof ConflictError) {
      throw new ConflictError();
    }
    throw e;
  } finally {
    dbConnection.release();
  }
}

/**
 * matchIDで大会情報取得
 * @param match_id
 * @returns
 */
export async function get(data: MathTableGetRequest): Promise<MatchTableData> {
  const matchTableModel = await MatchTableModel.get(data.match_id);

  //パスワードチェック
  if (matchTableModel.password !== data.password) {
    throw new Error("パスワードが違います。");
  }

  const matchTableResponse: MatchTableResponseEntity = {
    id: matchTableModel.id,
    title: matchTableModel.title,
    match_id: matchTableModel.match_id,
    auth_password: matchTableModel.auth_password ? true : false,
    created_at: matchTableModel.created_at,
    updated_at: matchTableModel.updated_at,
  };

  //参加プレイヤー取得
  const matchTablePlayer = await MatchTablePlayerModel.get(data.match_id);

  //対戦カード取得
  const matchTableOrder = await MatchTableOrderModel.get(data.match_id);

  //対戦結果取得
  const matchTableResult = await MatchTableResultModel.get(data.match_id);

  const result: MatchTableData = {
    matchTable: matchTableResponse,
    matchTablePlayer: matchTablePlayer,
    matchTableOrder: matchTableOrder,
    matchTableResult: matchTableResult,
  };

  return result;
}

/**
 * 大会情報更新
 * @param data
 */
export async function update(data: MatchTableUpdateRequest) {
  //更新認証スワードがあればチェック
  const matchTableModel = await MatchTableModel.get(data.match_id);
  if (
    matchTableModel.auth_password &&
    matchTableModel.auth_password !== data.auth_password
  ) {
    throw new Error("認証パスワードが違います。");
  }

  //対戦結果
  const matchTableResult: MatchTableResultEntity[] = data.matchTableResult;

  //対戦結果更新リスト
  let resultIdList: number[] = [];
  let resultList: number[] = [];
  matchTableResult.forEach((result) => {
    resultIdList.push(result.id);
    resultList.push(result.result);
  });

  //対戦結果更新データ
  const updateResult: MatchTableResultUpdate = {
    matchTableResultId: resultIdList,
    matchResult: resultList,
  };

  //対戦結果
  const matchTableOrder: MatchTableOrderEntity[] = data.matchTableOrder;

  //対戦カード更新リスト
  let orderIdList: number[] = [];
  let orderStatusList: number[] = [];
  matchTableOrder.forEach((result) => {
    orderIdList.push(result.id);
    orderStatusList.push(result.status);
  });

  //対戦結果更新データ
  const updateOrder: MatchTableOrderUpdate = {
    matchTableOrderId: orderIdList,
    status: orderStatusList,
  };

  const dbConnection = await dbPool.getConnection();
  try {
    await dbConnection.beginTransaction();

    //対戦結果更新
    await MatchTableResultModel.update(updateResult, dbConnection);
    //対戦カード更新
    await MatchTableOrderModel.update(updateOrder, dbConnection);

    await dbConnection.commit();
  } catch (e) {
    await dbConnection.rollback();
    if (e instanceof ConflictError) {
      throw new ConflictError();
    }
    throw e;
  } finally {
    dbConnection.release();
  }
}

/**
 * 認証チェック
 * @param data
 */
export async function authCheck(
  data: MathTableAuthCheckRequest
): Promise<void> {
  const matchTableModel = await MatchTableModel.get(data.match_id);

  //パスワードチェック
  if (matchTableModel.auth_password !== data.auth_password) {
    throw new Error("パスワードが違います。");
  }
}
