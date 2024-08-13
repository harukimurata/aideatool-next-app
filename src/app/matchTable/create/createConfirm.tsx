import { type MatchTableCreateRequest } from "@/types/MatchTable";

interface CreateConfirmProp {
  inputData: MatchTableCreateRequest;
  onSubmit: Function;
  onBack: Function;
}

export default function CreateConfirm(props: CreateConfirmProp) {
  const passwordCover = (value: string | undefined | null) => {
    if (!value) {
      return "設定なし";
    }
    let password = "";
    for (let i = 0; i < value.length; i++) {
      password = password + "*";
    }
    return password;
  };

  return (
    <>
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            対戦表つくーる
          </h1>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            対戦表作成確認
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                大会名
              </label>
              <div className="mt-2">
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {props.inputData.title}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                大会ID
              </label>
              <div className="mt-2">
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {props.inputData.match_id}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  大会パスワード
                </label>
              </div>
              <div className="mt-2">
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {passwordCover(props.inputData.password)}
                </p>
              </div>
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
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {passwordCover(props.inputData.auth_password)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                参加プレイヤー
              </label>
              <div className="mt-2">
                {props.inputData.player.map(
                  (element: string, index: number) => (
                    <div className="mb-1" key={index}>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        プレイヤー {index + 1}
                      </label>
                      <p className="text-sm leading-6 text-gray-600">
                        {element}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                onClick={() => props.onSubmit()}
              >
                作成
              </button>
              <button
                className="flex w-full justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-200 mt-2"
                onClick={() => props.onBack()}
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
