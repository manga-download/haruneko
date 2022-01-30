import { mock, mockClear, mockFn } from 'jest-mock-extended';
import type { ResourceKey } from '../i18n/ILocale';
import { Check, Text, Secret, Numeric, Choice, SettingsManager, Path, Setting, IValue } from './SettingsManager';
import type { StorageController } from './StorageController';
import type { Event } from './EventManager';

window.atob = function(encoded: string): string {
    return Buffer.from(encoded, 'base64').toString('utf-8');
};

window.btoa = function(decoded: string): string {
    return Buffer.from(decoded, 'utf-8').toString('base64');
};

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
            new Check('[ID]:Check', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, false),
            new Text('[ID]:Text', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, '{TEXT}'),
            new Secret('[ID]:Secret', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, '{SECRET}'),
            new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 50, 0, 100),
            new Choice('[ID]:Choice', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, '{CHOICE}', ...[
                { key: '{CHOICE}', label : null as ResourceKey },
                { key: '{STORED-CHOICE}', label : null as ResourceKey }
            ]),
            new Path('[ID]:Path', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, '{FILE/DIRECTORY}'),
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
            const expected = {};
            settings.forEach(setting => expected[setting.ID] = setting.Value);

            await testee.Initialize(...settings);

            for(const setting of settings) {
                setting.ValueChanged.Dispatch(setting as never, setting.Value as never);
                expect(storage.SavePersistent).toBeCalledTimes(1);
                expect(storage.SavePersistent).toBeCalledWith('settings.test-scope', expected);
                mockClear(storage);
            }
        });
    });

    describe('ValueChanged', () => {

        it('Should pass through notification for value changed when subscribed', async () => {
            const storage = mock<StorageController>();
            const testee = new SettingsManager(storage).OpenScope('test-scope');

            const callback = mockFn<(sender: Setting<IValue>, args: IValue) => void>();
            const settings = CreateSettings();
            await testee.Initialize(...settings);
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Subscribe(callback);

            for(const setting of settings) {
                (setting.ValueChanged as Event<Setting<IValue>, IValue>).Dispatch(setting, setting.Value);
                expect(callback).toBeCalledTimes(1);
                expect(callback).toBeCalledWith(setting, setting.Value);
                mockClear(callback);
            }
        });

        it('Should not pass through notification for value changed when unsubscribed', async () => {
            const storage = mock<StorageController>();
            const testee = new SettingsManager(storage).OpenScope('test-scope');

            const callback = mockFn<(sender: Setting<IValue>, args: IValue) => void>();
            const settings = CreateSettings();
            await testee.Initialize(...settings);
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Unsubscribe(callback);

            for(const setting of settings) {
                (setting.ValueChanged as Event<Setting<IValue>, IValue>).Dispatch(setting, setting.Value);
                expect(callback).toBeCalledTimes(0);
                mockClear(callback);
            }
        });
    });
});

describe('Check', () => {

    describe('Constructor', () => {

        it.each([ false, true ])('Should construct with correct parameters', async (value: boolean) => {
            const testee = new Check('[ID]:Check', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, value);

            expect(testee.Value).toBe(value);
            expect(testee.ID).toBe('[ID]:Check');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });
    });

    describe('Value', () => {

        it('Should correctly set value', async () => {
            const testee = new Check('[ID]:Check', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, false);
            testee.Value = true;
            expect(testee.Value).toBe(true);
        });
    });

    describe('ValueChanged', () => {

        it('Should not notify on value unchanged when subscribed', async () => {
            const testee = new Check('[ID]:Check', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, true);

            const callback = mockFn<(sender: Check, args: boolean) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.Value = true;

            expect(callback).toBeCalledTimes(0);
        });

        it('Should not notify on value changed when unsubscribed', async () => {
            const testee = new Check('[ID]:Check', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, false);

            const callback = mockFn<(sender: Check, args: boolean) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Unsubscribe(callback);
            testee.Value = true;

            expect(callback).toBeCalledTimes(0);
        });

        it('Should notify on value changed when subscribed', async () => {
            const testee = new Check('[ID]:Check', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, false);

            const callback = mockFn<(sender: Check, args: boolean) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Subscribe(callback);
            testee.Value = true;

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, true);
        });
    });
});

describe('Text', () => {

    describe('Constructor', () => {

        it('Should construct with correct parameters', async () => {
            const testee = new Text('[ID]:Text', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice');

            expect(testee.Value).toBe('alice');
            expect(testee.ID).toBe('[ID]:Text');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });
    });

    describe('Value', () => {

        it('Should correctly set value', async () => {
            const testee = new Text('[ID]:Text', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice');
            testee.Value = 'bob';
            expect(testee.Value).toBe('bob');
        });
    });

    describe('ValueChanged', () => {

        it('Should not notify on value unchanged when subscribed', async () => {
            const testee = new Text('[ID]:Text', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice');

            const callback = mockFn<(sender: Text, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.Value = 'alice';

            expect(callback).toBeCalledTimes(0);
        });

        it('Should not notify on value changed when unsubscribed', async () => {
            const testee = new Text('[ID]:Text', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice');

            const callback = mockFn<(sender: Text, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Unsubscribe(callback);
            testee.Value = 'bob';

            expect(callback).toBeCalledTimes(0);
        });

        it('Should notify on value changed when subscribed', async () => {
            const testee = new Text('[ID]:Text', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice');

            const callback = mockFn<(sender: Text, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Subscribe(callback);
            testee.Value = 'bob';

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, 'bob');
        });
    });
});

describe('Secret', () => {

    describe('Constructor', () => {

        it('Should construct with correct parameters', async () => {
            const testee = new Secret('[ID]:Secret', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice');

            expect(testee.Value).toBe('alice');
            expect(testee.ID).toBe('[ID]:Secret');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });
    });

    describe('Value', () => {

        it('Should correctly set value', async () => {
            const testee = new Secret('[ID]:Secret', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice');
            testee.Value = 'bob';
            expect(testee.Value).toBe('bob');
        });
    });

    describe('ValueChanged', () => {

        it('Should not notify on value unchanged when subscribed', async () => {
            const testee = new Secret('[ID]:Secret', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice');

            const callback = mockFn<(sender: Secret, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.Value = 'alice';

            expect(callback).toBeCalledTimes(0);
        });

        it('Should not notify on value changed when unsubscribed', async () => {
            const testee = new Secret('[ID]:Secret', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice');

            const callback = mockFn<(sender: Secret, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Unsubscribe(callback);
            testee.Value = 'bob';

            expect(callback).toBeCalledTimes(0);
        });

        it('Should notify on value changed when subscribed', async () => {
            const testee = new Secret('[ID]:Secret', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice');

            const callback = mockFn<(sender: Secret, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Subscribe(callback);
            testee.Value = 'bob';

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, 'bob');
        });
    });
});

describe('Numeric', () => {

    describe('Constructor', () => {

        it.each([-1, 0 , 1 ])('Should construct with correct parameters', async (value: number) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, value, -1, 1);

            expect(testee.Max).toBe(1);
            expect(testee.Min).toBe(-1);
            expect(testee.Value).toBe(value);
            expect(testee.ID).toBe('[ID]:Numeric');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });

        it('Should cap value below minimum', async () => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, -10, -5, 5);
            expect(testee.Max).toBe(5);
            expect(testee.Min).toBe(-5);
            expect(testee.Value).toBe(-5);
        });

        it('Should cap value above maximum', async () => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 10, -5, 5);
            expect(testee.Max).toBe(5);
            expect(testee.Min).toBe(-5);
            expect(testee.Value).toBe(5);
        });
    });

    describe('Value', () => {

        it.each([-1, 0, 1])('Should correctly set value', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 0, -1, 1);
            testee.Value = value;
            expect(testee.Max).toBe(1);
            expect(testee.Min).toBe(-1);
            expect(testee.Value).toBe(value);
        });

        it('Should cap value below minimum', async () => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 0, -5, 5);
            testee.Value = -10;
            expect(testee.Max).toBe(5);
            expect(testee.Min).toBe(-5);
            expect(testee.Value).toBe(-5);
        });

        it('Should cap value above maximum', async () => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 0, -5, 5);
            testee.Value = 10;
            expect(testee.Max).toBe(5);
            expect(testee.Min).toBe(-5);
            expect(testee.Value).toBe(5);
        });
    });

    describe('ValueChanged', () => {

        it.each([-5, -1, 0, 1, 5])('Should not notify on value unchanged when subscribed', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, value, -1, 1);

            const callback = mockFn<(sender: Numeric, args: number) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.Value = value;

            expect(callback).toBeCalledTimes(0);
        });

        it.each([-5, -1, 0, 1, 5])('Should not notify on value changed when unsubscribed', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 0, -1, 1);

            const callback = mockFn<(sender: Numeric, args: number) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Unsubscribe(callback);
            testee.Value = value;

            expect(callback).toBeCalledTimes(0);
        });

        it.each([-5, -1, 1, 5])('Should notify on value changed when subscribed', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 0, -5, 5);

            const callback = mockFn<(sender: Numeric, args: number) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Subscribe(callback);
            testee.Value = value;

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, value);
        });

        it.each([0, -1, -5])('Should notify on value changed when exceeding minimum', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, value, -1, 1);

            const callback = mockFn<(sender: Numeric, args: number) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.Value = -10;

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, -1);
        });

        it.each([0, 1, 5])('Should notify on value changed when exceeding maximum', async (value) => {
            const testee = new Numeric('[ID]:Numeric', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, value, -1, 1);

            const callback = mockFn<(sender: Numeric, args: number) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.Value = 10;

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, 1);
        });
    });
});

describe('Choice', () => {

    const options = [
        { key: 'alice', label: 'Alice' as ResourceKey },
        { key: 'bob', label: 'Bob' as ResourceKey }
    ];

    describe('Constructor', () => {

        it('Should construct with correct parameters', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice', ...options);

            expect(testee.Options).toStrictEqual(options);
            expect(testee.Value).toBe('alice');
            expect(testee.ID).toBe('[ID]:Choice');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });
    });

    describe('Value', () => {

        it('Should correctly set value', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice', ...options);
            testee.Value = 'bob';
            expect(testee.Value).toBe('bob');
        });

        it('Should use default when not in options', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice', ...options);
            testee.Value = 'chi';
            expect(testee.Value).toBe('alice');
        });
    });

    describe('ValueChanged', () => {

        it('Should not notify on value unchanged when subscribed', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice', ...options);

            const callback = mockFn<(sender: Choice, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.Value = 'alice';

            expect(callback).toBeCalledTimes(0);
        });

        it('Should not notify on value changed when unsubscribed', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice', ...options);

            const callback = mockFn<(sender: Choice, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Unsubscribe(callback);
            testee.Value = 'bob';

            expect(callback).toBeCalledTimes(0);
        });

        it('Should notify on valid value changed when subscribed', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice', ...options);

            const callback = mockFn<(sender: Choice, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Subscribe(callback);
            testee.Value = 'bob';

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, 'bob');
        });

        it('Should notify on invalid value changed when subscribed', async () => {
            const testee = new Choice('[ID]:Choice', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, 'alice', ...options);

            const callback = mockFn<(sender: Choice, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.Value = 'chi';

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, 'alice');
        });
    });
});

describe('Path', () => {

    describe('Constructor', () => {

        it('Should construct with correct parameters', async () => {
            const testee = new Path('[ID]:Path', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, '/path/file');

            expect(testee.Value).toBe('/path/file');
            expect(testee.ID).toBe('[ID]:Path');
            expect(testee.Label).toBe('[RES]:Label');
            expect(testee.Description).toBe('[RES]:Description');
        });
    });

    describe('Value', () => {

        it('Should correctly set value', async () => {
            const testee = new Path('[ID]:Path', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, '/path/file');
            testee.Value = '/path/directory';
            expect(testee.Value).toBe('/path/directory');
        });
    });

    describe('ValueChanged', () => {

        it('Should not notify on value unchanged when subscribed', async () => {
            const testee = new Path('[ID]:Path', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, '/path/file');

            const callback = mockFn<(sender: Path, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.Value = '/path/file';

            expect(callback).toBeCalledTimes(0);
        });

        it('Should not notify on value changed when unsubscribed', async () => {
            const testee = new Path('[ID]:Path', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, '/path/file');

            const callback = mockFn<(sender: Path, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Unsubscribe(callback);
            testee.Value = '/path/directory';

            expect(callback).toBeCalledTimes(0);
        });

        it('Should notify on value changed when subscribed', async () => {
            const testee = new Path('[ID]:Path', '[RES]:Label' as ResourceKey, '[RES]:Description' as ResourceKey, '/path/file');

            const callback = mockFn<(sender: Path, args: string) => void>();
            testee.ValueChanged.Subscribe(callback);
            testee.ValueChanged.Subscribe(callback);
            testee.Value = '/path/directory';

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, '/path/directory');
        });
    });
});