import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicpash',
        title: 'Comic Pash'
    },
    container: {
        url: 'https://comicpash.jp/series/9c3589223cb9f',
        id: '/series/9c3589223cb9f',
        title: '恋文指南'
    },
    child: {
        id: '/episodes/b17beac58b99e/',
        title: '合わせ鏡の恋'
    },
    entry: {
        index: 0,
        size: 572_415,
        type: 'image/png'
    }
}).AssertWebsite();