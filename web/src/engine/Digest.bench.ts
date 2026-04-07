import { describe, bench } from 'vitest';
import * as Hash from './Digest';

const ascending = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const descending = 'ZYXWVUTSRQPONMLKJIHGFEDCBA9876543210';

describe('Digest', () => {

    describe('Hash (32 Bit)', () => {
        bench('Hash32 (dec)', () => {
            Hash.Hash32(ascending, Hash.Format.Dec);
            Hash.Hash32(descending, Hash.Format.Dec);
        });
        bench('Hash32 (hex)', () => {
            Hash.Hash32(ascending, Hash.Format.Hex);
            Hash.Hash32(descending, Hash.Format.Hex);
        });
        bench('Hash32 (alphanumeric)', () => {
            Hash.Hash32(ascending, Hash.Format.Alpha);
            Hash.Hash32(descending, Hash.Format.Alpha);
        });
    });

    describe('Hash (36 Bit)', () => {
        bench('Hash64 (dec)', () => {
            Hash.Hash64(ascending, Hash.Format.Dec);
            Hash.Hash64(descending, Hash.Format.Dec);
        });
        bench('Hash64 (hex)', () => {
            Hash.Hash64(ascending, Hash.Format.Hex);
            Hash.Hash64(descending, Hash.Format.Hex);
        });
        bench('Hash64 (alphanumeric)', () => {
            Hash.Hash64(ascending, Hash.Format.Alpha);
            Hash.Hash64(descending, Hash.Format.Alpha);
        });
    });
});