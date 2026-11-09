import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lewdmanhwa',
        title: 'LewdManhwa'
    },
    container: {
        url: 'https://lewdmanhwa.com/webtoon/antisocial-safety-zone',
        id: '/webtoon/antisocial-safety-zone',
        title: 'Antisocial Safety Zone',
    },
    child: {
        id: '/webtoon/antisocial-safety-zone/chapter-23',
        title: 'Chapter 18' // yeah, site is messed up like that
    },
    entry: {
        index: 0,
        size: 513_476,
        type: 'image/webp'
    }
}).AssertWebsite();