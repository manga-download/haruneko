import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toondex',
        title: 'Toondex'
    },
    container: {
        url: 'https://toondex.xyz/comics/the-bosss-daughter-sldwya/',
        id: '/comics/the-bosss-daughter-sldwya/',
        title: 'The Boss’s Daughter'
    },
    child: {
        id: '/comics/the-bosss-daughter-sldwya/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 648_140,
        type: 'image/webp'
    }
}).AssertWebsite();