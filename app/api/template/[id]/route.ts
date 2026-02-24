import { db } from "@/lib/db";
import { NextRequest } from "next/server";

import REACT from "@/lib/template-data/REACT.json";
import NEXTJS from "@/lib/template-data/NEXTJS.json";
import EXPRESS from "@/lib/template-data/EXPRESS.json";
import VUE from "@/lib/template-data/VUE.json";
import HONO from "@/lib/template-data/HONO.json";
import ANGULAR from "@/lib/template-data/ANGULAR.json";

const templateData: Record<string, unknown> = {
  REACT,
  NEXTJS,
  EXPRESS,
  VUE,
  HONO,
  ANGULAR,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  const playground = await db.playground.findUnique({
    where: { id },
  });

  if (!playground) {
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }

  const templateKey = playground.template as string;
  const templateJson = templateData[templateKey];

  if (!templateJson) {
    return Response.json({ error: "Invalid template" }, { status: 404 });
  }

  return Response.json({ success: true, templateJson }, { status: 200 });
}