import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwahub',
        title: 'ManhwaHub'
    },
    container: {
        url: 'https://manhwahub.net/webtoon/thorns-on-innocence',
        id: '/webtoon/thorns-on-innocence',
        title: 'Thorns on Innocence'
    },
    child: {
        id: '/webtoon/thorns-on-innocence/chapter-100',
        title: 'Chapter 100'
    },
    entry: {
        index: 0,
        size: 182_482,
        type: 'image/jpeg'
    }
}).AssertWebsite();