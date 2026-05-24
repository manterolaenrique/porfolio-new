import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const expectedSecret = process.env.REVALIDATE_SECRET
    if (!expectedSecret) {
      return NextResponse.json(
        { message: 'Server misconfigured: missing REVALIDATE_SECRET' },
        { status: 500 },
      )
    }

    const secret = req.nextUrl.searchParams.get('secret')
    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const defaultPaths = ['/', '/projects']
    let requestedPaths: string[] = []

    try {
      const body = await req.json()
      if (Array.isArray(body?.paths)) {
        requestedPaths = body.paths.filter(
          (path: unknown): path is string =>
            typeof path === 'string' && path.startsWith('/'),
        )
      }
    } catch {
      // The webhook body is optional.
    }

    const pathsToRevalidate = Array.from(
      new Set([...defaultPaths, ...requestedPaths]),
    )

    for (const path of pathsToRevalidate) {
      revalidatePath(path)
    }

    return NextResponse.json({ revalidated: true, paths: pathsToRevalidate })
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
