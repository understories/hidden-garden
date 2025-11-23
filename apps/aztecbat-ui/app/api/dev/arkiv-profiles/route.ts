import { NextResponse } from 'next/server';
import {
  listArkivSkillProfiles,
} from '@hidden-garden/core-logic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const humanOnly = url.searchParams.get('humanOnly') === 'true';
  const allowAgentsOnly = url.searchParams.get('allowAgentsOnly') === 'true';

  try {
    const profiles = await listArkivSkillProfiles({ humanOnly, allowAgentsOnly });
    return NextResponse.json({ ok: true, profiles });
  } catch (error: any) {
    console.error('[api/dev/arkiv-profiles]', error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}

