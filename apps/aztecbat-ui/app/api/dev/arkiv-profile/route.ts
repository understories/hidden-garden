import { NextResponse } from 'next/server';
import { getArkivSkillProfile } from '@hidden-garden/core-logic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = url.searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { ok: false, error: 'Missing address' },
      { status: 400 },
    );
  }

  try {
    const profile = await getArkivSkillProfile(address);
    return NextResponse.json({ ok: true, profile });
  } catch (error: any) {
    console.error('[api/dev/arkiv-profile]', error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}

