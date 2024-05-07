import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sheakomik',
        title: 'Shea Komik'
    },
    container: {
        url: 'https://sheakomik.com/manga/best-son-in-law/',
        id: '/manga/best-son-in-law/',
        title: 'Best Son-In-Law'
    },
    child: {
        id: '/best-son-in-law-chapter-00-bahasa-indonesia/',
        title: 'Chapter 00'
    },
    entry: {
        index: 1,
        size: 164_108,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());