import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangashiro',
        title: 'MangaShiro'
    },
    container: {
        url: 'https://mangashiro.me/manga/hackgu/',
        id: '/manga/hackgu/',
        title: '.hack//G.U.+'
    },
    child: {
        id: '/hackg-u-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 115_639,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());