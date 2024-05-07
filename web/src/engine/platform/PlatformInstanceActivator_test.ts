// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { InternalError } from '../Error';
import { Runtime, type PlatformInfo } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';

class Fake {
    constructor(public readonly id: string) {}
}

describe('PlatformInstanceProvider', () => {

    describe('Create', () => {

        const cases = [
            Runtime.Electron,
            Runtime.NodeWebkit,
        ];

        it.each(cases)(`Should throw by default`, async (runtime: Runtime) => {
            const testee = new PlatformInstanceActivator();
            try {
                await testee.Create(runtime);
            } catch(error) {
                expect(error).toBeInstanceOf(InternalError);
                expect(error.message).toBe(`Failed to create an instance of type <T> for platform '${runtime}'!`);
            }
        });

        it.each(cases)(`Should create instance for '%p' using platform info`, async (runtime: Runtime) => {
            const actual = new PlatformInstanceActivator<Fake>({ Runtime: runtime } as PlatformInfo)
                .Configure(runtime, () => new Fake('😎'))
                .Create();
            expect(actual).toBeInstanceOf(Fake);
            expect(actual.id).toBe('😎');
        });

        it.each(cases)(`Should create instance for '%p' using parameter`, async (runtime: Runtime) => {
            const actual = new PlatformInstanceActivator<Fake>({ Runtime: Runtime.Unknown } as PlatformInfo)
                .Configure(runtime, () => new Fake('😎'))
                .Create(runtime);
            expect(actual).toBeInstanceOf(Fake);
            expect(actual.id).toBe('😎');
        });
    });
});