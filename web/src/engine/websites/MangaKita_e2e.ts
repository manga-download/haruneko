import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangakita',
        title: 'MangaKita'
    },
    container: {
        url: 'https://mangakita.id/manga/closer/',
        id: '/manga/closer/',
        title: '[C]LOSER'
    },
    child: {
        id: '/closer-chapter-30-bahasa-indonesia/',
        title: 'Chapter 30',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 93552,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());