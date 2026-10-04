import { vi, describe, it, expect } from 'vitest';
import type { HakuNeko } from '../engine/HakuNeko';
import { Exception, InternalError, NotImplementedError } from './Error';
import type { Choice, ISettings, SettingsManager } from './SettingsManager';
import { LocaleID, EngineResourceKey } from '../i18n/ILocale';
import { Key } from './SettingsGlobal';

// Mocking globals
{
    const mockChoice = { Value: LocaleID.Locale_enUS } as unknown as Choice;
    const mockSettings = { Get: vi.fn(key => key === Key.Language ? mockChoice : undefined) } as unknown as ISettings;
    const mockSettingsManager = { OpenScope: vi.fn(() => mockSettings) } as unknown as SettingsManager;

    globalThis.HakuNeko = Object.assign(globalThis.HakuNeko ?? {}, {
        SettingsManager: mockSettingsManager
    }) as unknown as HakuNeko;
}

describe('Error', () => {

    describe('InternalError', () => {

        it('Should create a new instance with expected properties', () => {
            const testee = new InternalError('😈');
            expect(testee).toBeInstanceOf(Error);
            expect(testee.name).toBe('InternalError');
            expect(testee.message).toBe('😈');
        });

        it('Should create a new derived instance with expected properties', () => {
            class DerivedInternalError extends InternalError {}
            const testee = new DerivedInternalError('😈');
            expect(testee).toBeInstanceOf(Error);
            expect(testee.name).toBe('DerivedInternalError');
            expect(testee.message).toBe('😈');
        });
    });

    describe('NotImplementedError', () => {

        it('Should create a new instance with expected properties', () => {
            const testee = new NotImplementedError('😈');
            expect(testee).toBeInstanceOf(Error);
            expect(testee.name).toBe('NotImplementedError');
            expect(testee.message).toBe('😈');
        });
    });

    describe('Exception', () => {

        it('Should create a new instance with expected properties', () => {
            const testee = new Exception(EngineResourceKey.FetchProvider_FetchWindow_CloudFlareError, '😈');
            expect(testee).toBeInstanceOf(Error);
            expect(testee.name).toBe('Exception<FetchProvider_FetchWindow_CloudFlareError>');
            expect(testee.message).toBe('The request failed due to the following CloudFlare Error: "😈"');
        });

        it('Should create a new derived instance with expected properties', () => {
            class DerivedException extends Exception {}
            const testee = new DerivedException(EngineResourceKey.FetchProvider_FetchWindow_CloudFlareError, '😈');
            expect(testee).toBeInstanceOf(Error);
            expect(testee.name).toBe('DerivedException<FetchProvider_FetchWindow_CloudFlareError>');
            expect(testee.message).toBe('The request failed due to the following CloudFlare Error: "😈"');
        });
    });
});