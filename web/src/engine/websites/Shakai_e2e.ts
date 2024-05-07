import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'shakai',
        title: 'Shakai'
    },
    container: {
        url: 'https://shakai.ru/manga/2489',
        id: '2489',
        title: 'Oyasumi Punpun / Спокойной ночи, Пунпун',
    },
    child: {
        id: '13_147',
        title: '13_147'
    },
    entry: {
        index: 0,
        size: 513_938,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());