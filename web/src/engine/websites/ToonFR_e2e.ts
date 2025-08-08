import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toonfr',
        title: 'ToonFR'
    },
    container: {
        url: 'https://toonfr.com/webtoon/fratrie-foldingue/',
        id: JSON.stringify({ post: '873', slug: '/webtoon/fratrie-foldingue/' }),
        title: 'Fratrie Foldingue'
    },
    child: {
        id: '/webtoon/fratrie-foldingue/00/p873-ch-150/',
        title: 'Ep 150'
    },
    entry: {
        index: 0,
        size: 354_558,
        type: 'image/jpeg'
    }
}).AssertWebsite();