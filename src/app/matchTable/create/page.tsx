"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateConfirm from "./createConfirm";
import CommonModal from "@/app/components/commonModal";
import ErrorModal from "@/app/components/errorModal";
import { createMatchTable } from "@/logic/apiRequest";
import { type MatchTableCreateRequest } from "@/types/MatchTable";

export default function MatchTableCreate() {
  const router = useRouter();

  const [formData, setFormData] = useState<MatchTableCreateRequest>({
    title: "",
    match_id: "",
    password: "",
    player: ["player_A", "player_B"],
    auth_password: null,
  });

  //入力確認切り替えフラグ
  const [isConfirm, setIsConfirm] = useState<Boolean>(false);
  //入力判定
  const [isTitleEmpty, setIsTitleEmpty] = useState<Boolean>(false);
  const [isMatchIdEmpty, setIsMatchIdEmpty] = useState<Boolean>(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<Boolean>(false);
  //モーダル
  const [isCommonModal, setIsCommonModal] = useState<Boolean>(false);
  const [commonModalTitle, setCommonModalTitle] = useState<string>("");
  const [commonModalText, setCommonModalText] = useState<string>("");
  //エラーモーダル
  const [isErrorModal, setIsErrorModal] = useState<Boolean>(false);
  const [errorModalText, setErrorModalText] = useState<string>("");

  //配列の動的更新処理
  const playerInput = (index: number, value: string) => {
    const newPlayerList = formData.player;
    newPlayerList[index] = value;
    setFormData({ ...formData, player: newPlayerList });
  };

  //プレイヤーの追加
  const playerAdd = () => {
    const newPlayerList = formData.player;
    newPlayerList.push("player" + (newPlayerList.length + 1));
    setFormData({ ...formData, player: newPlayerList });
  };

  //プレイヤーの削除
  const playerDelete = () => {
    if (formData.player.length <= 2) {
      return;
    }
    const newPlayerList = formData.player;
    newPlayerList.pop();
    setFormData({ ...formData, player: newPlayerList });
  };

  //入力データの確認
  const formDataConfirm = () => {
    if (formData.title == "" || formData.title == null) {
      setIsTitleEmpty(true);
      return;
    } else {
      setIsTitleEmpty(false);
    }

    if (formData.match_id == "" || formData.match_id == null) {
      setIsMatchIdEmpty(true);
      return;
    } else {
      setIsMatchIdEmpty(false);
    }

    if (formData.password == "" || formData.password == null) {
      setIsPasswordEmpty(true);
      return;
    } else {
      setIsPasswordEmpty(false);
    }
    setIsConfirm(true);
  };

  //大会記入情報確認
  const createConfirmComponent = () => {
    if (isConfirm) {
      return (
        <CreateConfirm
          inputData={formData}
          onSubmit={() => create()}
          onBack={() => createConfirmClose()}
        ></CreateConfirm>
      );
    }
  };

  //大会記入情報確認非表示
  const createConfirmClose = () => {
    setIsConfirm(false);
  };

  //大会情報作成処理
  const create = async () => {
    try {
      const result = await createMatchTable(formData);
      setCommonModalTitle(result.message);
      setCommonModalText("参加画面に移動します。");
      setIsCommonModal(true);
    } catch (e: any) {
      setErrorModalText(e.response.data.message);
      setIsErrorModal(true);
    }
  };

  //大会名記入漏れエラーメッセージ
  const titleEmptyMessage = () => {
    if (isTitleEmpty) {
      return (
        <p className="mt-3 text-sm leading-6 text-red-600">
          大会名が記入されていません
        </p>
      );
    }
  };

  //大会ID記入漏れエラーメッセージ
  const matchIdEmptyMessage = () => {
    if (isMatchIdEmpty) {
      return (
        <p className="mt-3 text-sm leading-6 text-red-600">
          大会IDが記入されていません
        </p>
      );
    }
  };

  //大会パスワード記入漏れエラーメッセージ
  const passwordEmptyMessage = () => {
    if (isPasswordEmpty) {
      return (
        <p className="mt-3 text-sm leading-6 text-red-600">
          大会パスワードが記入されていません
        </p>
      );
    }
  };

  //モーダル表示
  const commonModalComponent = () => {
    if (isCommonModal) {
      return (
        <CommonModal
          title={commonModalTitle}
          text={commonModalText}
          onClick={() => commonModalClose()}
        ></CommonModal>
      );
    }
  };

  //モーダル非表示
  const commonModalClose = () => {
    setIsCommonModal(false);
    toLink("/matchTable/login");
  };

  //エラーモーダル表示
  const errorModalComponent = () => {
    if (isErrorModal) {
      return (
        <ErrorModal
          text={errorModalText}
          onClick={() => errorModalClose()}
        ></ErrorModal>
      );
    }
  };

  //エラーモーダル非表示
  const errorModalClose = () => {
    setIsErrorModal(false);
  };

  const toLink = (path: string) => {
    router.push(path);
  };

  //入力フォーム
  const createMain = () => {
    if (!isConfirm) {
      return (
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              対戦表つくーる
            </h1>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              対戦表作成画面
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  大会名
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                    }}
                  />
                </div>
                {titleEmptyMessage()}
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  大会ID
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.match_id}
                    onChange={(e) => {
                      setFormData({ ...formData, match_id: e.target.value });
                    }}
                  />
                </div>
                {matchIdEmptyMessage()}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    大会パスワード
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                  />
                </div>
                {passwordEmptyMessage()}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    編集権限パスワード
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      任意
                    </span>
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.auth_password ?? ""}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        auth_password: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  参加プレイヤー
                </label>
                <div className="mt-2">
                  {formData.player.map((element, index) => (
                    <div className="mb-1" key={index}>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        プレイヤー {index + 1}
                      </label>
                      <input
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={element}
                        onChange={(e) => {
                          playerInput(index, e.target.value);
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div
                  className="inline-flex rounded-md shadow-sm mt-2"
                  role="group"
                >
                  <button
                    type="button"
                    className="inline-flex items-center px-2 py-1 text-sm font-medium text-red-600 bg-white border border-gray-200 rounded-s-lg hover:bg-red-100 focus:z-10 text-nowrap"
                    onClick={playerAdd}
                  >
                    追加
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-2 py-1 text-sm font-medium text-cyan-600 bg-white border border-gray-200 rounded-e-lg hover:bg-cyan-200 focus:z-10 text-nowrap"
                    onClick={playerDelete}
                  >
                    削除
                  </button>
                </div>
              </div>

              <div>
                <button
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                  onClick={formDataConfirm}
                >
                  確認
                </button>
                <button
                  className="flex w-full justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-200 mt-2"
                  onClick={() => toLink("/matchTable")}
                >
                  やめる
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {createMain()}
      {createConfirmComponent()}
      {commonModalComponent()}
      {errorModalComponent()}
    </>
  );
}
