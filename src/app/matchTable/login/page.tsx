"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getMatchTable } from "@/logic/apiRequest";
import { type MathTableGetRequest } from "@/types/MatchTable";
import ErrorModal from "@/app/components/errorModal";

export default function MatchTableLogin() {
  const router = useRouter();

  const [formData, setFormData] = useState<MathTableGetRequest>({
    match_id: "",
    password: "",
  });

  //入力判定
  const [isMatchIdEmpty, setIsMatchIdEmpty] = useState<Boolean>(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<Boolean>(false);
  //モーダル
  const [isErrorModal, setIsErrorModal] = useState<Boolean>(false);
  const [errorModalText, setErrorModalText] =
    useState<string>("予期せぬエラーが発生しました");

  //入力データの確認
  const formDataConfirm = () => {
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

    login();
  };

  //ログイン処理
  const login = async () => {
    try {
      const result = await getMatchTable(formData);
      if (result) {
        localStorage.setItem("matchTableData", JSON.stringify(result));
        localStorage.setItem("loginInfo", JSON.stringify(formData));
        toLink("/matchTable/main");
      }
    } catch (e: any) {
      setErrorModalText(e.response.data.message);
      setIsErrorModal(true);
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

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            対戦表つくーる
          </h1>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            ログイン
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
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
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={formDataConfirm}
              >
                ログイン
              </button>
              <button
                className="flex w-full justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-200 mt-2"
                onClick={() => toLink("/matchTable")}
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </div>
      {errorModalComponent()}
    </>
  );
}
