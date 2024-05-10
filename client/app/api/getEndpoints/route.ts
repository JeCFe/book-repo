import { NextResponse } from "next/server";

export const GET = () => NextResponse.json(process.env.BASE_URL);

export const dynamic = "force-dynamic";
