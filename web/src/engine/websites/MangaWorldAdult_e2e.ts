import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangaworldadult',
        title: 'Manga World Adult'
    },
    container: {
        url: 'https://www.mangaworldadult.net/manga/1089/15y',
        id: '/manga/1089/15y',
        title: '15Y+'
    },
    child: {
        id: '/manga/1089/15y/read/5f7e3f9e6c6c3610d5922b81?style=list',
        title: 'Capitolo 20'
    },
    entry: {
        index: 0,
        size: 79_800,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());