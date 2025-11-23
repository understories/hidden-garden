/**
 * Arkiv Skill Profile Helpers
 * 
 * Implements three operations for managing skill profile snapshots in Arkiv.
 * When DISABLE_ARKIV=true, uses stub implementations with demo data.
 */

// Feature flag check (same as client.ts)
const ARKIV_DISABLED =
  process.env.DISABLE_ARKIV === 'true' ||
  process.env.NEXT_PUBLIC_DISABLE_ARKIV === 'true';

import { arkivWalletClient, arkivPublicClient } from './client';
import type { ArkivSkillProfilePayload } from './types';

const PROFILE_TYPE = 'skill_profile';
const SKILL_PATH = 'aztec_builder';

// Stub demo profiles for when Arkiv is disabled
function createStubProfile(address: string): ArkivSkillProfilePayload {
  return {
    address: address.toLowerCase(),
    chainId: 31337, // Local Hardhat chain
    humanVerified: true,
    allowAgents: false,
    aztecBuilderTier: 2,
    aztecBuilderSkillHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    externalBadges: [
      { id: 'aztec-builder', label: 'Aztec Builder', source: 'hackathon' },
      { id: 'noir-basics', label: 'Noir Basics', source: 'other' },
    ],
    lastUpdated: Date.now(),
  };
}

// Create a new snapshot entity (append-only). For demo we don't dedupe.
export async function upsertArkivSkillProfile(
  snapshot: ArkivSkillProfilePayload,
): Promise<{ entityKey: string; txHash: string } | null> {
  if (ARKIV_DISABLED) {
    console.log('[arkiv] Arkiv is disabled; skipping write');
    return null;
  }

  if (!arkivWalletClient) {
    console.warn('[arkiv] wallet client not configured; skipping write');
    return null;
  }

  // Only import SDK when Arkiv is enabled
  try {
    const {
      jsonToPayload,
      ExpirationTime,
    } = require('@arkiv-network/sdk/utils');

    const payload = jsonToPayload(snapshot);

    const { entityKey, txHash } = await arkivWalletClient.createEntity({
      payload,
      contentType: 'application/json',
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
  } catch (error) {
    // Handle stub client errors gracefully
    if (error instanceof Error && error.message.includes('Arkiv is disabled')) {
      console.log('[arkiv] Arkiv is disabled; skipping write');
      return null;
    }
    console.warn('[arkiv] Error creating entity:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

// Fetch the latest snapshot for a specific address (or null)
export async function getArkivSkillProfile(
  address: string,
): Promise<ArkivSkillProfilePayload | null> {
  if (ARKIV_DISABLED) {
    // Return stub demo profile when disabled
    console.log('[arkiv] Arkiv is disabled; returning stub profile');
    return createStubProfile(address);
  }

  if (!arkivPublicClient) {
    console.warn('[arkiv] public client not configured; cannot read profiles');
    return null;
  }

  // Only import SDK when Arkiv is enabled
  try {
    const { eq } = require('@arkiv-network/sdk/query');
    const { payloadToJson } = require('@arkiv-network/sdk/utils');

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
  } catch (error) {
    console.warn('[arkiv] Error fetching profile:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

// List many profiles with simple filters for the leaderboard page
export async function listArkivSkillProfiles(opts?: {
  humanOnly?: boolean;
  allowAgentsOnly?: boolean;
}): Promise<ArkivSkillProfilePayload[]> {
  if (ARKIV_DISABLED) {
    // Return stub demo profiles when disabled
    console.log('[arkiv] Arkiv is disabled; returning stub profiles');
    
    // Create a few demo profiles
    const demoAddresses = [
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Hardhat account 0
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Hardhat account 1
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // Hardhat account 2
    ];

    let profiles = demoAddresses.map(addr => createStubProfile(addr));

    // Apply filters to stub data
    if (opts?.humanOnly) {
      profiles = profiles.filter(p => p.humanVerified);
    }
    if (opts?.allowAgentsOnly) {
      profiles = profiles.filter(p => p.allowAgents);
    }

    return profiles;
  }

  if (!arkivPublicClient) {
    console.warn('[arkiv] public client not configured; cannot list profiles');
    return [];
  }

  // Only import SDK when Arkiv is enabled
  try {
    const { eq } = require('@arkiv-network/sdk/query');
    const { payloadToJson } = require('@arkiv-network/sdk/utils');

    let q = arkivPublicClient
      .buildQuery()
      .where(eq('type', PROFILE_TYPE).and(eq('skill_path', SKILL_PATH)))
      .withAttributes(true)
      .withPayload(true);

    // Apply filters (tutorial pattern: chain .where() calls)
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
  } catch (error) {
    console.warn('[arkiv] Error listing profiles:', error instanceof Error ? error.message : String(error));
    return [];
  }
}
