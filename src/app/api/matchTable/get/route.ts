import { NextResponse, type NextRequest } from "next/server";
import * as typeGuard from "../../helpers/typeGuard";
import {
  MatchTableData,
  MathTableGetRequest,
} from "../../interfaces/matchTable/matchTable";
import { ConflictError } from "../../interfaces/my-error";
import * as MatchTableService from "../../service/matchTable/matchTableService";

const MATCH_ID_MAX_LENGTH = 30;
const PASSWORD_MAX_LENGTH = 30;

/**
 * 大会情報取得
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  try {
    const body: MathTableGetRequest = await request.json();
    if (!body.match_id || !body.password) {
      throw new Error("パラメータが不正です。");
    }

    //パラメータの存在チェック
    let requestParm: MathTableGetRequest;
    //パラメータの型チェック
    if (
      typeGuard.IsString(body.match_id) &&
      typeGuard.IsMaxLength(body.match_id, MATCH_ID_MAX_LENGTH) &&
      typeGuard.IsString(body.password) &&
      typeGuard.IsMaxLength(body.password, PASSWORD_MAX_LENGTH)
    ) {
      requestParm = {
        match_id: body.match_id,
        password: body.password,
      };
    } else {
      throw new Error("パラメータの値が不正です。");
    }
    const result: MatchTableData = await MatchTableService.get(requestParm);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error instanceof ConflictError) {
      return NextResponse.json(
        { message: "大会データの作成に失敗しました。" },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
