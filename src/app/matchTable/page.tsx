"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MatchTableHome() {
  const router = useRouter();

  const toLink = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            対戦表つくーる
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Link
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 mb-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            href="/matchTable/create"
          >
            作成する
          </Link>
          <Link
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 mb-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            href="/matchTable/login"
          >
            参加する
          </Link>

          <button
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 mb-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => toLink("/")}
          >
            homeに戻る
          </button>
        </div>
      </div>
    </>
  );
}
