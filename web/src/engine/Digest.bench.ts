import { describe, bench } from 'vitest';
import * as Hash from './Digest';

const cipher = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

describe('Digest', () => {

    bench('DBJ2', () => {
        Hash.DJB2(cipher);
    });

    bench('SDBM', () => {
        Hash.SDBM(cipher);
    });

    bench('FNV1A', () => {
        Hash.FNV1A(cipher);
    });
});