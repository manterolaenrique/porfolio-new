import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { authorizeRevalidation } from "@/services/revalidation";

export async function POST(req: NextRequest) {
  try {
    const authorization = authorizeRevalidation(req, {
      legacy: process.env.REVALIDATE_SECRET,
      webhook: process.env.NEXORA_REVALIDATE_SECRET,
    });
    if (authorization === "unconfigured") {
      return NextResponse.json(
        { message: "Server misconfigured: missing REVALIDATE_SECRET" },
        { status: 500 },
      );
    }

    if (authorization !== "authorized") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const defaultPaths = ["/", "/projects", "/nexora"];
    let requestedPaths: string[] = [];

    try {
      const body = await req.json();
      if (Array.isArray(body?.paths)) {
        requestedPaths = body.paths.filter(
          (path: unknown): path is string =>
            typeof path === "string" && path.startsWith("/"),
        );
      }
    } catch {
      // The webhook body is optional.
    }

    const pathsToRevalidate = Array.from(
      new Set([...defaultPaths, ...requestedPaths]),
    );

    // The root layout also covers cached project detail pages and shared CMS data.
    revalidateTag("nexora");
    revalidatePath("/", "layout");
    for (const path of pathsToRevalidate.filter((path) => path !== "/")) {
      if (path === "/nexora") revalidatePath(path, "layout");
      else revalidatePath(path);
    }

    return NextResponse.json({ revalidated: true, paths: pathsToRevalidate });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
