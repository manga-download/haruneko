import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lianscans',
        title: 'LIAN'
    },
    container: {
        url: 'https://www.lianscans.com/manga/lian-short-yuri-collection/',
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

new TestFixture(config).AssertWebsite();