"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import CommonModal from "@/app/components/commonModal";
import ErrorModal from "@/app/components/errorModal";
import { getMatchTable, updateMatchTable } from "@/logic/apiRequest";
import { type MatchTableUpdateRequest } from "@/types/MatchTable";
import {
  type MatchTableData,
  type MathTableGetRequest,
} from "@/types/MatchTable";
import { type MatchTablePlayerEntity } from "@/types/entity/matchTablePlayer";
import { type MatchTableOrderEntity } from "@/types/entity/matchTableOrder";
import { type MatchTableResultEntity } from "@/types/entity/matchTableResult";

export default function MatchTableMain() {
  const router = useRouter();

  //大会情報
  const [title, setTitle] = useState<string>();
  const [matchTableData, setMatchTableData] = useState<MatchTableData>();
  const [playerList, setPlayerLIst] = useState<MatchTablePlayerEntity[]>([]);
  const [resultList, setResultList] = useState<MatchTableResultEntity[]>([]);
  const [orderList, setOrderList] = useState<MatchTableOrderEntity[]>([]);
  const [authPassword, setAuthPassword] = useState<string>("");

  const [loginInfo, setLoginInfo] = useState<MathTableGetRequest>();

  //モーダル
  const [isCommonModal, setIsCommonModal] = useState<boolean>(false);
  const [commonModalTitle, setCommonModalTitle] = useState<string>("");
  const [commonModalText, setCommonModalText] = useState<string>("");
  //エラーモーダル
  const [isErrorModal, setIsErrorModal] = useState<boolean>(false);
  const [errorModalText, setErrorModalText] = useState<string>("");
  //その他制御系
  const [isUpdateRequest, setIsUpdateRequest] = useState<boolean>(false);
  const [isAuthPasswordModal, setIsAuthPasswordModal] =
    useState<boolean>(false);
  const [isButtonView, setButtonView] = useState<boolean>(false);

  useEffect(() => {
    const localStorageMatchTableData = localStorage.getItem("matchTableData");
    const localStorageLoginInfo = localStorage.getItem("loginInfo");
    console.log("useEffect");
    console.log("localStorageMatchTableData", localStorageMatchTableData);
    console.log("localStorageLoginInfo", localStorageLoginInfo);

    if (localStorageMatchTableData == null || localStorageLoginInfo == null) {
      setErrorModalText("大会情報が見つかりませんでした。");
      setIsErrorModal(true);
    } else {
      const matchTableData: MatchTableData = JSON.parse(
        localStorageMatchTableData
      );
      setMatchTableData(matchTableData);
      setTitle(matchTableData.matchTable.title);
      setPlayerLIst(matchTableData.matchTablePlayer);
      setResultList(matchTableData.matchTableResult);
      setOrderList(matchTableData.matchTableOrder);

      const loginInfo: MathTableGetRequest = JSON.parse(localStorageLoginInfo);
      setLoginInfo(loginInfo);
    }
  }, [setTitle, setPlayerLIst, setResultList, setOrderList, setLoginInfo]);

  /**
   * ローカルデータの更新
   * サーバーと同期
   */
  const localUpdate = async () => {
    try {
      if (!loginInfo) {
        return;
      }
      const result = await getMatchTable(loginInfo);
      setResultList(result.matchTableResult);
      setOrderList(result.matchTableOrder);
    } catch (e: any) {
      setErrorModalText(e.response.data.message);
      setIsErrorModal(true);
    }
  };

  /**
   * データ送信時のモーダル表示判定
   */
  const updateModalIsActive = async () => {
    setIsUpdateRequest(true);
    if (!matchTableData) {
      return;
    }

    if (matchTableData.matchTable.auth_password) {
      setIsAuthPasswordModal(true);
    } else {
      await serverUpdate();
    }
  };

  /**
   * ローカルデータ送信
   */
  const serverUpdate = async () => {
    if (!loginInfo || !matchTableData) {
      return;
    }
    try {
      const reqData: MatchTableUpdateRequest = {
        match_id: loginInfo.match_id,
        auth_password: authPassword,
        matchTableResult: resultList,
        matchTableOrder: orderList,
      };
      const result = await updateMatchTable(reqData);
      setCommonModalTitle("");
      setCommonModalText(result.message);
      setIsCommonModal(true);
    } catch (e: any) {
      setErrorModalText(e.response.data.message);
      setIsErrorModal(true);
    }
  };

  /**
   * 勝ち数計算
   */
  const countWinner = (playerA_id: number) => {
    let resultNum = 0;
    for (const val of resultList) {
      if (val.playerA_id == playerA_id) {
        resultNum = resultNum + val.result;
      }
    }
    return resultNum;
  };

  /**
   * 勝率計算
   */
  const calcWinningPercentage = (playerA_id: number) => {
    let resultNum = 0;
    for (const val of resultList) {
      if (val.playerA_id == playerA_id) {
        resultNum = resultNum + val.result;
      }
    }
    const winPercentage =
      resultNum / (resultNum + (playerList.length - 1 - resultNum));
    return (winPercentage * 100).toFixed(1);
  };

  /**
   * 順位計算
   */
  const calcRank = (playerA_id: number) => {
    let rankList = [];

    for (const player of playerList) {
      rankList.push({ player_id: player.id, winCount: countWinner(player.id) });
    }

    const sortRankList = rankList.sort((a, b) => {
      return b.winCount - a.winCount;
    });

    let rank = 0;
    sortRankList.forEach((list, index) => {
      if (playerA_id == list.player_id) {
        rank = index + 1;
      }
    });

    return rank;
  };

  /**
   * 勝敗投入
   * @param verti
   * @param hori
   * @param value
   */
  const setResult = (playerA_id: number, playerB_id: number, value: number) => {
    const newResultList = [...resultList];
    newResultList.forEach((result) => {
      if (result.playerA_id == playerA_id && result.playerB_id == playerB_id) {
        result.result = value == 1 ? 1 : 0;
      }

      if (result.playerB_id == playerA_id && result.playerA_id == playerB_id) {
        result.result = value !== 1 ? 1 : 0;
      }
    });

    setResultList(newResultList);
  };

  /**
   * 勝ち負け表示
   * @param value
   */
  const resultConvert = (playerA_id: number, playerB_id: number) => {
    const result = resultList.find((value) => {
      return value.playerA_id == playerA_id && value.playerB_id == playerB_id;
    });
    return result?.result == 1 ? "勝ち" : "負け";
  };

  /**
   * フォントカラー変更
   * @param value
   */
  const textColor = (playerA_id: number, playerB_id: number) => {
    const result = resultList.find((value) => {
      return value.playerA_id == playerA_id && value.playerB_id == playerB_id;
    });
    return result?.result == 1 ? "text-red-600" : "text-cyan-600";
  };

  //ボタン非表示切り替え
  const changeButtonView = (event: any) => {
    setButtonView(!isButtonView);
  };

  /**
   * プレイヤー名表示
   * @param index
   */
  const findPlayerName = (index: number) => {
    const player = playerList.find((value) => {
      return value.id == index;
    });

    return player?.name;
  };

  /**
   * 対戦状況更新
   * @param index
   */
  const battleFlow = (index: number) => {
    setOrderList((prevValue) => {
      const newOrderList = [...prevValue];
      if (newOrderList[index].status == 2) {
        newOrderList[index].status = 0;
      } else {
        newOrderList[index].status = newOrderList[index].status + 1;
      }
      return newOrderList;
    });
  };

  /**
   * 対戦状況管理
   * @param value
   */
  const battleState = (value: number) => {
    switch (value) {
      case 0:
        return {
          state: "対戦前",
          color: "text-gray-900 bg-white hover:bg-gray-100",
        };
      case 1:
        return {
          state: "対戦中",
          color: "text-cyan-600 bg-cyan-100 hover:bg-cyan-200",
        };
      case 2:
        return {
          state: "終了",
          color: "text-green-600 bg-green-100 hover:bg-green-200",
        };
      default:
        return {
          state: "対戦前",
          color: "text-gray-900 bg-white hover:bg-gray-100",
        };
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
    setIsAuthPasswordModal(false);
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
    if (!isUpdateRequest) {
      toLink("/MatchTable/login");
    }
    setIsUpdateRequest(false);
  };

  //認証パスワード要求モーダル
  const authPasswordModal = () => {
    if (isAuthPasswordModal) {
      return (
        <Dialog
          open={isAuthPasswordModal}
          onClose={setIsAuthPasswordModal}
          className="relative z-10"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
              >
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-200 sm:mx-0 sm:h-10 sm:w-10">
                      <InformationCircleIcon
                        aria-hidden="true"
                        className="h-6 w-6 text-cyan-600"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        認証パスワードが設定されています。
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          認証パスワードを入力してください。
                        </p>
                        <input
                          type="text"
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={authPassword}
                          onChange={(e) => {
                            setAuthPassword(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => serverUpdate()}
                  >
                    送信
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAuthPasswordModal(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    閉じる
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      );
    }
  };

  //ログアウト
  const logout = () => {
    localStorage.setItem("matchTableInfo", "");
    localStorage.setItem("matchTableLoginInfo", "");
    toLink("/matchTable");
  };

  const toLink = (path: string) => {
    router.push(path);
  };

  //メインテーブル
  const renderMainTable = (playerList: MatchTablePlayerEntity[]) => {
    if (playerList) {
      return (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Player
                </th>
                {playerList.map((player) => (
                  <th className="px-6 py-3 text-center" key={player.id}>
                    {player.name}
                  </th>
                ))}
                <th scope="col">勝ち数</th>
                <th scope="col">勝率</th>
                <th scope="col">順位</th>
              </tr>
            </thead>
            <tbody>
              {playerList.map((player_vertical, vertical_index) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={vertical_index}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {player_vertical.name}
                  </th>
                  {playerList.map((player_horizontal, horizontal_index) => (
                    <td
                      className="px-6 py-4 text-center"
                      key={horizontal_index}
                    >
                      {renderTableData(
                        vertical_index,
                        horizontal_index,
                        player_vertical,
                        player_horizontal
                      )}
                    </td>
                  ))}
                  <td>
                    <p>{countWinner(player_vertical.id)}</p>
                  </td>
                  <td>
                    <p>{calcWinningPercentage(player_vertical.id)}%</p>
                  </td>
                  <td>
                    <p>{calcRank(player_vertical.id)}位</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  //テーブル内のセル
  const renderTableData = (
    vertical_index: number,
    horizontal_index: number,
    player_vertical: MatchTablePlayerEntity,
    player_horizontal: MatchTablePlayerEntity
  ) => {
    if (!matchTableData) {
      return;
    }

    if (vertical_index == horizontal_index) {
      return <div>―</div>;
    } else {
      return (
        <>
          {resultButton(player_vertical.id, player_horizontal.id)}
          <p className={textColor(player_vertical.id, player_horizontal.id)}>
            {resultConvert(player_vertical.id, player_horizontal.id)}
          </p>
        </>
      );
    }
  };

  //勝ち負けボタン
  const resultButton = (playerA_id: number, playerB_id: number) => {
    if (!isButtonView) {
      return (
        <>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className="inline-flex items-center px-2 py-1 text-sm font-medium text-red-600 bg-white border border-gray-200 rounded-s-lg hover:bg-red-100 focus:z-10 text-nowrap"
              onClick={() => setResult(playerA_id, playerB_id, 1)}
            >
              勝ち
            </button>
            <button
              type="button"
              className="inline-flex items-center px-2 py-1 text-sm font-medium text-cyan-600 bg-white border border-gray-200 rounded-e-lg hover:bg-cyan-200 focus:z-10 text-nowrap"
              onClick={() => setResult(playerA_id, playerB_id, 0)}
            >
              負け
            </button>
          </div>
        </>
      );
    }
  };

  //対戦表メインコンポーネント
  const matchTableMainComponent = () => {
    if (matchTableData) {
      return (
        <>
          <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {title}
          </h1>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-left">
              <button
                type="button"
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
                onClick={() => logout()}
              >
                ログアウト
              </button>
            </div>
            <div className="text-right">
              <button
                type="button"
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-green-600 focus:outline-none bg-green-100 rounded-lg border hover:bg-green-200"
                onClick={() => localUpdate()}
              >
                サーバーと同期
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
            対戦結果
          </h2>
          <div className="columns is-mobile is-centered mx-2">
            <div className="column is-12 px-0">
              <div className="table-width">{renderMainTable(playerList)}</div>
              <div className="has-text-left ml-2">
                <label className="checkbox">
                  <input type="checkbox" onChange={changeButtonView} />
                  ボタン非表示
                </label>
              </div>

              <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                対戦カード
              </h2>
              <p className="has-text-left ml-2">全 {orderList.length}試合</p>

              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        対戦カード
                      </th>
                      <th scope="col" className="px-6 py-3">
                        対戦状況
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderList.map((order, index) => (
                      <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        key={index}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {findPlayerName(order.playerA_id)} vs{" "}
                          {findPlayerName(order.playerB_id)}
                        </th>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            className={`font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${
                              battleState(order.status).color
                            }`}
                            onClick={() => battleFlow(index)}
                          >
                            {battleState(order.status).state}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 my-2"
              onClick={() => updateModalIsActive()}
            >
              変更を送信する
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="mx-3">
      {matchTableMainComponent()}
      {authPasswordModal()}
      {commonModalComponent()}
      {errorModalComponent()}
    </div>
  );
}
