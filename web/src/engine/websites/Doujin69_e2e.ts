import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'doujin69',
        title: 'Doujin69'
    },
    container: {
        url: 'https://doujin69.com/doujin/boarding-diary/',
        id: '/doujin/boarding-diary/',
        title: 'Boarding Diary'
    },
    child: {
        id: encodeURI('/boarding-diary-ตอนที่1/').toLocaleLowerCase(),
        title: 'ตอนที่ 1'
    },
    entry: {
        index: 0,
        size: 268_843,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());