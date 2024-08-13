import { NextResponse, type NextRequest } from "next/server";
/**
 * getリクエスト ヘルスチェック
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  console.log(query);
  let message = "Health Check";
  if (!query) {
    message = "Health Check. You can add '?query=value'.";
  } else {
    message = "Health Check. query=" + query;
  }
  return NextResponse.json({ message: message }, { status: 200 });
}

interface HealthPostBody {
  text: string;
  price: number;
}

interface HealthPostResponseBody {
  title: string;
  text: string;
  price: number;
}
/**
 * postリクエスト ヘルスチェック
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  try {
    const body: HealthPostBody = await request.json();
    if (!body.text || !body.price) {
      throw new Error(
        "health check Post Method Error. include text(type: string), price(type: number) in body."
      );
    }

    const response: HealthPostResponseBody = {
      title: "Health Check Post Method",
      text: body.text,
      price: body.price,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
