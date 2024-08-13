import { NextResponse, type NextRequest } from "next/server";
import * as typeGuard from "../../helpers/typeGuard";
import { MatchTableCreateRequest } from "../../interfaces/matchTable/matchTable";
import { ConflictError } from "../../interfaces/my-error";
import * as MatchTableService from "../../service/matchTable/matchTableService";

const TITLE_MAX_LENGTH = 30;
const MATCH_ID_MAX_LENGTH = 30;
const PASSWORD_MAX_LENGTH = 30;

/**
 * 大会情報作成
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  try {
    const body: MatchTableCreateRequest = await request.json();
    //更新に必要なデータの確認
    if (!body.title || !body.match_id || !body.password || !body.player) {
      throw new Error("パラメータが不正です。");
    }

    //パラメータの存在チェック
    let inputData: MatchTableCreateRequest;
    //パラメータの型チェック
    if (
      typeGuard.IsString(body.title) &&
      typeGuard.IsMaxLength(body.title, TITLE_MAX_LENGTH) &&
      typeGuard.IsString(body.match_id) &&
      typeGuard.IsMaxLength(body.match_id, MATCH_ID_MAX_LENGTH) &&
      typeGuard.IsString(body.password) &&
      typeGuard.IsMaxLength(body.password, PASSWORD_MAX_LENGTH) &&
      typeGuard.IsStringArray(body.player)
    ) {
      inputData = {
        title: body.title,
        match_id: body.match_id,
        password: body.password,
        player: body.player,
        auth_password: body.auth_password,
      };
    } else {
      throw new Error("パラメータの値が不正です。");
    }

    await MatchTableService.create(inputData);
    return NextResponse.json(
      { message: "大会データを作成しました。" },
      { status: 200 }
    );
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
