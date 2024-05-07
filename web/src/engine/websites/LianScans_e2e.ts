import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lianscans',
        title: 'LIAN'
    },
    container: {
        url: 'https://www.lianscans.my.id/manga/lian-short-yuri-collection/',
        id: '/manga/lian-short-yuri-collection/',
        title: 'LIAN Short Yuri Collection'
    },
    child: {
        id: '/lian-short-yuri-collection-chapter-01-bahasa-indonesia/',
        title: 'Chapter 01 - Findomu (Matsukura Nemu)'
    },
    entry: {
        index: 0,
        size: 395_926,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());