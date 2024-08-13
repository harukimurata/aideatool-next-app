import { NextResponse, type NextRequest } from "next/server";
import * as typeGuard from "../../helpers/typeGuard";
import { MatchTableOrderEntity } from "@/types/entity/matchTableOrder";
import { MatchTableResultEntity } from "@/types/entity/matchTableResult";
import { MatchTableUpdateRequest } from "../../interfaces/matchTable/matchTable";
import { ConflictError } from "../../interfaces/my-error";
import * as MatchTableService from "../../service/matchTable/matchTableService";

const PASSWORD_MAX_LENGTH = 30;

/**
 * 大会情報更新
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  try {
    const body: MatchTableUpdateRequest = await request.json();
    //更新に必要なデータの確認
    if (!body.match_id || !body.matchTableResult || !body.matchTableOrder) {
      throw new Error("パラメータが不正です。");
    }

    //パラメータの存在チェック
    let updateData: MatchTableUpdateRequest;
    //パラメータの型チェック
    if (
      typeGuard.IsString(body.match_id) &&
      typeGuard.IsMaxLength(body.auth_password, PASSWORD_MAX_LENGTH) &&
      typeGuard.IsOriginalType<MatchTableResultEntity[]>(
        body.matchTableResult
      ) &&
      typeGuard.IsOriginalType<MatchTableOrderEntity[]>(body.matchTableOrder)
    ) {
      updateData = {
        match_id: body.match_id,
        auth_password: body.auth_password,
        matchTableResult: body.matchTableResult,
        matchTableOrder: body.matchTableOrder,
      };
    } else {
      throw new Error("パラメータの値が不正です。");
    }

    await MatchTableService.update(updateData);
    return NextResponse.json(
      { message: "大会データを更新しました。" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof ConflictError) {
      return NextResponse.json(
        { message: "大会データの更新に失敗しました。" },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
