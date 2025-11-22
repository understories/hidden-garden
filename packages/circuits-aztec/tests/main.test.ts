import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { CompiledCircuit, ProofData } from '@noir-lang/types';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('main circuit', () => {
  let circuit: CompiledCircuit;
  let backend: BarretenbergBackend;

  beforeAll(async () => {
    const circuitPath = join(__dirname, '../target/main.json');
    circuit = JSON.parse(readFileSync(circuitPath, 'utf-8'));
    backend = new BarretenbergBackend(circuit);
  });

  afterAll(async () => {
    await backend.destroy();
  });

  it('should verify valid proof', async () => {
    const noir = new Noir(circuit);
    const { returnValue } = await noir.execute({ a: 1, b: 2, c: 3 });
    expect(returnValue).toBeUndefined();
  });
});

