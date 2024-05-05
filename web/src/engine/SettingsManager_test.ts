// @vitest-environment jsdom
import { mock, mockClear } from 'vitest-mock-extended';
import { vi, describe, it, expect } from 'vitest';
import type { HakuNeko } from './HakuNeko';
import { LocaleID, type EngineResourceKey } from '../i18n/ILocale';
import { Check, Text, Secret, Numeric, Choice, SettingsManager, Directory, type ISettings } from './SettingsManager';
import { type StorageController, Store } from './StorageController';
import { Key } from './SettingsGlobal';

window.atob = function(encoded: string): string {
    return Buffer.from(encoded, 'base64').toString('utf-8');
};

window.btoa = function(decoded: string): string {
    return Buffer.from(decoded, 'utf-8').toString('base64');
};

// Mocking globals
{
    const mockChoice = mock<Choice>({ Value: LocaleID.Locale_enUS });

    const mockSettigns = mock<ISettings>();
    mockSettigns.Get.calledWith(Key.Language).mockReturnValue(mockChoice);

    const mockSettingsManager = mock<SettingsManager>();
    mockSettingsManager.OpenScope.mockReturnValue(mockSettigns);

    window.HakuNeko = mock<HakuNeko>({ SettingsManager: mockSettingsManager });
}

describe('SettingsManager', () => {

    describe('OpenScope', () => {

        it('Should get an existing scope', async () => {
            const storage = mock<StorageController>();
            const testee = new SettingsManager(storage);

            expect(testee.OpenScope('x')).toBe(testee.OpenScope('x'));
            expect(storage.LoadPersistent).toBeCalledTimes(0);
            expect(storage.SavePersistent).toBeCalledTimes(0);
        });

        it('Should create a scope if not exist', async () => {
            const storage = mock<StorageController>();
            const testee = new SettingsManager(storage);

            expect(testee.OpenScope('a')).not.toBe(testee.OpenScope('1'));
            expect(storage.LoadPersistent).toBeCalledTimes(0);
            expect(storage.SavePersistent).toBeCalledTimes(0);
        });
    });
});

describe('Settings', () => {

    function CreateSettings() {
        return [
            new Check('[ID]:Check', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, false),
            new Text('[ID]:Text', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, '{TEXT}'),
            new Secret('[ID]:Secret', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, '{SECRET}'),
            new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 50, 0, 100),
            new Choice('[ID]:Choice', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, '{CHOICE}', ...[
                { key: '{CHOICE}', label: null as EngineResourceKey },
                { key: '{STORED-CHOICE}', label: null as EngineResourceKey }
            ]),
            new Directory('[ID]:Path', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, null),
        ];
    }

    describe('Initialize', () => {

        it('Should apply values from persistant storage', async () => {
            const storage = mock<StorageController>();
            const testee = new SettingsManager(storage).OpenScope('test-scope');

            storage.LoadPersistent.mockReturnValue(Promise.resolve({
                '[ID]:Check': true,
                '[ID]:Text': '{STORED-TEXT}',
                '[ID]:Secret': 'e1NUT1JFRC1FTkNSWVBURUR9',
                '[ID]:Numeric': 17,
                '[ID]:Choice': '{STORED-CHOICE}',
                '[ID]:Path': '{STORED-PATH}',
                '[ID]:INVALID': '{}',
            }));

            await testee.Initialize(...CreateSettings());

            expect([...testee].find(setting => setting.ID === '[ID]:Check').Value).toBe(true);
            expect([...testee].find(setting => setting.ID === '[ID]:Text').Value).toBe('{STORED-TEXT}');
            expect([...testee].find(setting => setting.ID === '[ID]:Secret').Value).toBe('{STORED-ENCRYPTED}');
            expect([...testee].find(setting => setting.ID === '[ID]:Numeric').Value).toBe(17);
            expect([...testee].find(setting => setting.ID === '[ID]:Choice').Value).toBe('{STORED-CHOICE}');
            expect([...testee].find(setting => setting.ID === '[ID]:Path').Value).toBe('{STORED-PATH}');
            expect([...testee].find(setting => setting.ID === '[ID]:INVALID')).toBeUndefined();
        });

        it('Should only be called once', async () => {
            const testee = new SettingsManager(mock<StorageController>()).OpenScope('test-scope');

            await testee.Initialize();
            await expect(testee.Initialize(...CreateSettings())).rejects.toThrow(/<test-scope>/);

            expect([...testee]).toHaveLength(0);
        });

        it('Should be iterable through all settings', async () => {
            const testee = new SettingsManager(mock<StorageController>()).OpenScope('test-scope');

            const expected = CreateSettings();
            await testee.Initialize(...expected);
            const actual = [...testee];

            expect(actual).toStrictEqual(expected);
        });

        it('Should save persistant when any setting changed', async () => {
            const storage = mock<StorageController>();
            const testee = new SettingsManager(storage).OpenScope('test-scope');

            const settings = CreateSettings();
            const expected = {
                '[ID]:Check': false,
                '[ID]:Text': '{TEXT}',
                '[ID]:Secret': 'e1NFQ1JFVH0=',
                '[ID]:Numeric': 50,
                '[ID]:Choice': '{CHOICE}',
                '[ID]:Path': null,
            };

            await testee.Initialize(...settings);

            for(const setting of settings) {
                setting.Dispatch();
                expect(storage.SavePersistent).toHaveBeenCalledTimes(1);
                expect(storage.SavePersistent).toHaveBeenCalledWith(expected, Store.Settings, 'test-scope');
                mockClear(storage);
            }
        });
    });

    describe('Get', () => {

        const settings = CreateSettings();

        it.each([...settings])('Should get existing settings', async (setting) => {
            const storage = mock<StorageController>();
            const testee = new SettingsManager(storage).OpenScope('test-scope');

            const stored = {};
            for(const setting of settings) {
                stored[setting.ID] = setting.Value;
            }
            storage.LoadPersistent.mockReturnValue(Promise.resolve(stored));

            await testee.Initialize(...settings);

            expect(testee.Get(setting.ID).Value).toBe(setting.Value);
        });

        it('Should not get non-existing setting', async () => {
            const storage = mock<StorageController>();
            const testee = new SettingsManager(storage).OpenScope('test-scope');

            await testee.Initialize(...settings);

            expect(testee.Get('-')).toBeUndefined();
        });
    });
});

describe('Check', () => {

    describe('Constructor', () => {

        it.each([ false, true ])('Should construct with correct parameters', async (value: boolean) => {
            const testee = new Check('[ID]:Check', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, value);

            expect(testee.Value).toBe(value);
            expect(testee.ID).toBe('[ID]:Check');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });
    });

    describe('Value', () => {

        it('Should correctly set value', async () => {
            const testee = new Check('[ID]:Check', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, false);
            testee.Value = true;
            expect(testee.Value).toBe(true);
        });
    });

    describe('ValueChanged', () => {

        it('Should not notify on value unchanged when subscribed', async () => {
            const testee = new Check('[ID]:Check', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, true);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Value = true;

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should not notify on value changed when unsubscribed', async () => {
            const testee = new Check('[ID]:Check', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, false);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Unsubscribe(callback);
            testee.Value = true;

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should notify on value changed when subscribed', async () => {
            const testee = new Check('[ID]:Check', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, false);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Subscribe(callback);
            testee.Value = true;

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(true, undefined);
        });
    });
});

describe('Text', () => {

    describe('Constructor', () => {

        it('Should construct with correct parameters', async () => {
            const testee = new Text('[ID]:Text', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice');

            expect(testee.Value).toBe('alice');
            expect(testee.ID).toBe('[ID]:Text');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });
    });

    describe('Value', () => {

        it('Should correctly set value', async () => {
            const testee = new Text('[ID]:Text', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice');
            testee.Value = 'bob';
            expect(testee.Value).toBe('bob');
        });
    });

    describe('ValueChanged', () => {

        it('Should not notify on value unchanged when subscribed', async () => {
            const testee = new Text('[ID]:Text', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice');

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Value = 'alice';

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should not notify on value changed when unsubscribed', async () => {
            const testee = new Text('[ID]:Text', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice');

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Unsubscribe(callback);
            testee.Value = 'bob';

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should notify on value changed when subscribed', async () => {
            const testee = new Text('[ID]:Text', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice');

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Subscribe(callback);
            testee.Value = 'bob';

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('bob', undefined);
        });
    });
});

describe('Secret', () => {

    describe('Constructor', () => {

        it('Should construct with correct parameters', async () => {
            const testee = new Secret('[ID]:Secret', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice');

            expect(testee.Value).toBe('alice');
            expect(testee.ID).toBe('[ID]:Secret');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });
    });

    describe('Value', () => {

        it('Should correctly set value', async () => {
            const testee = new Secret('[ID]:Secret', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice');
            testee.Value = 'bob';
            expect(testee.Value).toBe('bob');
        });
    });

    describe('ValueChanged', () => {

        it('Should not notify on value unchanged when subscribed', async () => {
            const testee = new Secret('[ID]:Secret', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice');

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Value = 'alice';

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should not notify on value changed when unsubscribed', async () => {
            const testee = new Secret('[ID]:Secret', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice');

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Unsubscribe(callback);
            testee.Value = 'bob';

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should notify on value changed when subscribed', async () => {
            const testee = new Secret('[ID]:Secret', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice');

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Subscribe(callback);
            testee.Value = 'bob';

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('bob', undefined);
        });
    });
});

describe('Numeric', () => {

    describe('Constructor', () => {

        it.each([-1, 0, 1 ])('Should construct with correct parameters', async (value: number) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, value, -1, 1);

            expect(testee.Max).toBe(1);
            expect(testee.Min).toBe(-1);
            expect(testee.Value).toBe(value);
            expect(testee.ID).toBe('[ID]:Numeric');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });

        it('Should cap value below minimum', async () => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, -10, -5, 5);
            expect(testee.Max).toBe(5);
            expect(testee.Min).toBe(-5);
            expect(testee.Value).toBe(-5);
        });

        it('Should cap value above maximum', async () => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 10, -5, 5);
            expect(testee.Max).toBe(5);
            expect(testee.Min).toBe(-5);
            expect(testee.Value).toBe(5);
        });
    });

    describe('Value', () => {

        it.each([-1, 0, 1])('Should correctly set value', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 0, -1, 1);
            testee.Value = value;
            expect(testee.Max).toBe(1);
            expect(testee.Min).toBe(-1);
            expect(testee.Value).toBe(value);
        });

        it('Should cap value below minimum', async () => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 0, -5, 5);
            testee.Value = -10;
            expect(testee.Max).toBe(5);
            expect(testee.Min).toBe(-5);
            expect(testee.Value).toBe(-5);
        });

        it('Should cap value above maximum', async () => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 0, -5, 5);
            testee.Value = 10;
            expect(testee.Max).toBe(5);
            expect(testee.Min).toBe(-5);
            expect(testee.Value).toBe(5);
        });
    });

    describe('ValueChanged', () => {

        it.each([-5, -1, 0, 1, 5])('Should assign valid default value', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, value, -5, 5);
            expect(testee.Value).toBe(value);
        });

        it('Should truncate default value when exceeding minimum', async () => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, -5, -1, 1);
            expect(testee.Value).toBe(-1);
        });

        it('Should truncate default value when exceeding maximum', async () => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 5, -1, 1);
            expect(testee.Value).toBe(1);
        });

        it.each([-5, -1, 0, 1, 5])('Should not notify on value unchanged when subscribed', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, value, -5, 5);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Value = value;

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it.each([-5, -1, 0, 1, 5])('Should not notify on value changed when unsubscribed', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 0, -5, 5);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Unsubscribe(callback);
            testee.Value = value;

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it.each([-5, -1, 1, 5])('Should notify on value changed when subscribed', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 0, -5, 5);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Subscribe(callback);
            testee.Value = value;

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(value, undefined);
        });

        it.each([-1, -5])('Should notify on value changed when exceeding minimum', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 0, -1, 1);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Value = value;

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(-1, undefined);
        });

        it.each([1, 5])('Should notify on value changed when exceeding maximum', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 0, -1, 1);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Value = value;

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(1, undefined);
        });
    });
});

describe('Choice', () => {

    const options = [
        { key: 'alice', label: 'Alice' as EngineResourceKey },
        { key: 'bob', label: 'Bob' as EngineResourceKey }
    ];

    describe('Constructor', () => {

        it('Should construct with correct parameters', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice', ...options);

            expect(testee.Options).toStrictEqual(options);
            expect(testee.Value).toBe('alice');
            expect(testee.ID).toBe('[ID]:Choice');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });
    });

    describe('Value', () => {

        it('Should correctly set value', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice', ...options);
            testee.Value = 'bob';
            expect(testee.Value).toBe('bob');
        });

        it('Should use default when not in options', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice', ...options);
            testee.Value = 'chi';
            expect(testee.Value).toBe('alice');
        });
    });

    describe('ValueChanged', () => {

        it('Should not notify on same value assigned when subscribed', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice', ...options);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Value = 'alice';

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should not notify on valid value assigned when unsubscribed', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice', ...options);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Unsubscribe(callback);
            testee.Value = 'bob';

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should notify on valid value assigned when subscribed', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice', ...options);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Subscribe(callback);
            testee.Value = 'bob';

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('bob', undefined);
        });

        it('Should not notify on invalid value assigned to default when subscribed', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice', ...options);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Value = 'cc';

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should notify on invalid value assigned to non-default when subscribed', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, 'alice', ...options);
            testee.Value = 'bob';

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Value = 'cc';

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('alice', undefined);
        });
    });
});

describe('Directory', () => {

    describe('Constructor', () => {

        it('Should construct with correct parameters', async () => {
            const testee = new Directory('[ID]:Path', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, { name: '/path/file', kind: 'directory' } as FileSystemDirectoryHandle);

            expect(testee.Value.name).toBe('/path/file');
            expect(testee.ID).toBe('[ID]:Path');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });
    });

    describe('Value', () => {

        it('Should correctly set value', async () => {
            const testee = new Directory('[ID]:Path', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, { name: '/path/file', kind: 'directory' } as FileSystemDirectoryHandle);
            testee.Value = { name: '/path/directory', kind: 'directory' } as FileSystemDirectoryHandle;
            expect(testee.Value.name).toBe('/path/directory');
        });
    });

    describe('ValueChanged', () => {

        it('Should not notify on value unchanged when subscribed', async () => {
            const directory = { name: '/path/file', kind: 'directory' } as FileSystemDirectoryHandle;
            const testee = new Directory('[ID]:Path', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, directory);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Value = directory;

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should not notify on value changed when unsubscribed', async () => {
            const testee = new Directory('[ID]:Path', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, { name: '/path/file', kind: 'directory' } as FileSystemDirectoryHandle);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Unsubscribe(callback);
            testee.Value = { name: '/path/directory', kind: 'directory' } as FileSystemDirectoryHandle;

            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('Should notify on value changed when subscribed', async () => {
            const testee = new Directory('[ID]:Path', '[RES]:Label' as EngineResourceKey, '[RES]:Description' as EngineResourceKey, { name: '/path/file', kind: 'directory' } as FileSystemDirectoryHandle);

            const callback = vi.fn();
            testee.Subscribe(callback);
            testee.Subscribe(callback);
            testee.Value = { name: '/path/directory', kind: 'directory' } as FileSystemDirectoryHandle;

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(testee.Value, undefined);
        });
    });
});