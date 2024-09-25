import { describe, bench } from 'vitest';
import * as Hash from './Digest';

const ascending = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const descending = 'ZYXWVUTSRQPONMLKJIHGFEDCBA9876543210';

describe('Digest', () => {

    bench('DBJ2', () => {
        Hash.DJB2(ascending);
        Hash.DJB2(descending);
    });

    bench('SDBM', () => {
        Hash.SDBM(ascending);
        Hash.SDBM(descending);
    });

    bench('FNV1A', () => {
        Hash.FNV1A(ascending);
        Hash.FNV1A(descending);
    });

    bench('DJB64', () => {
        Hash.DJB64(ascending);
        Hash.DJB64(descending);
    });
});