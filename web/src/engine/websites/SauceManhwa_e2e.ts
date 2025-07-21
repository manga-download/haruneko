import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'saucemanhwa',
        title: 'SauceManhwa'
    },
    container: {
        url: 'https://saucemanhwa.org/the-chairmans-wife',
        id: 'the-chairmans-wife',
        title: 'The Chairman’s Wife'
    },
    child: {
        id: '/the-chairmans-wife/chap-63',
        title: 'Chapter 63'
    },
    entry: {
        index: 0,
        size: 340_244,
        type: 'image/webp'
    }
}).AssertWebsite();