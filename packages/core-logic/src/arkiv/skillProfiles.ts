/**
 * Arkiv Skill Profile Helpers
 * 
 * Implements three operations for managing skill profile snapshots in Arkiv:
 * - upsertArkivSkillProfile: write a new snapshot (append-only)
 * - getArkivSkillProfile: fetch latest snapshot for a specific address
 * - listArkivSkillProfiles: list snapshots for leaderboard view
 */

import {
  jsonToPayload,
  payloadToJson,
  ExpirationTime,
} from '@arkiv-network/sdk/utils';
import { eq } from '@arkiv-network/sdk/query';
import { arkivWalletClient, arkivPublicClient } from './client';
import type { ArkivSkillProfilePayload } from './types';

const PROFILE_TYPE = 'skill_profile';
const SKILL_PATH = 'aztec_builder';

// Create a new snapshot entity (append-only). For demo we don't dedupe.
export async function upsertArkivSkillProfile(
  snapshot: ArkivSkillProfilePayload,
) {
  if (!arkivWalletClient) {
    console.warn('[arkiv] wallet client not configured; skipping write');
    return null;
  }

  const payload = jsonToPayload(snapshot);

  const { entityKey, txHash } = await arkivWalletClient.createEntity({
    payload,
    contentType: 'application/json',
    // Long-ish TTL; not important for demo
    expiresIn: ExpirationTime.fromDays(180),
    attributes: [
      { key: 'type', value: PROFILE_TYPE },
      { key: 'skill_path', value: SKILL_PATH },
      { key: 'address', value: snapshot.address.toLowerCase() },
      { key: 'human', value: snapshot.humanVerified ? 1 : 0 },
      { key: 'allow_agents', value: snapshot.allowAgents ? 1 : 0 },
    ],
  });

  return { entityKey, txHash };
}

// Fetch the latest snapshot for a specific address (or null)
export async function getArkivSkillProfile(
  address: string,
): Promise<ArkivSkillProfilePayload | null> {
  if (!arkivPublicClient) {
    console.warn('[arkiv] public client not configured; cannot read profiles');
    return null;
  }

  const query = arkivPublicClient.buildQuery();

  const res = await query
    .where(
      eq('type', PROFILE_TYPE)
        .and(eq('skill_path', SKILL_PATH))
        .and(eq('address', address.toLowerCase())),
    )
    .orderBy('created', 'desc')
    .limit(1)
    .withAttributes(false)
    .withPayload(true)
    .fetch();

  const first = res.entities[0];
  if (!first?.payload) return null;

  return payloadToJson(first.payload) as ArkivSkillProfilePayload;
}

// List many profiles with simple filters for the leaderboard page
export async function listArkivSkillProfiles(opts?: {
  humanOnly?: boolean;
  allowAgentsOnly?: boolean;
}): Promise<ArkivSkillProfilePayload[]> {
  if (!arkivPublicClient) {
    console.warn('[arkiv] public client not configured; cannot list profiles');
    return [];
  }

  let q = arkivPublicClient
    .buildQuery()
    .where(eq('type', PROFILE_TYPE).and(eq('skill_path', SKILL_PATH)))
    .withAttributes(true)
    .withPayload(true);

  if (opts?.humanOnly) {
    q = q.where(eq('human', 1));
  }
  if (opts?.allowAgentsOnly) {
    q = q.where(eq('allow_agents', 1));
  }

  const res = await q.fetch();

  return res.entities
    .filter((e) => e.payload)
    .map((e) => payloadToJson(e.payload!) as ArkivSkillProfilePayload);
}

