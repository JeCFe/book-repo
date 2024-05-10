import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const GET = withApiAuthRequired(async function protected_(req) {
  const { accessToken } = await getAccessToken(req, new NextResponse());
  return NextResponse.json(accessToken);
});
