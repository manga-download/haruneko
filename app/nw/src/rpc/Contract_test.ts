import { describe, it, expect } from 'vitest';
import type { PlatformIPC } from '../../../../web/src/engine/platform/InterProcessCommunicationTypes';
import { Contract } from './Contract';

describe('Contract', () => {

    describe('Constructor', () => {

        it('Should create instance', () => {
            const testee = new Contract(<PlatformIPC>{});
            expect(testee).toBeDefined();
        });
    });
});