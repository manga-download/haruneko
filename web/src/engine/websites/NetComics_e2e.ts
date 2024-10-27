import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: French Locale
new TestFixture({
    plugin: {
        id: 'netcomics',
        title: 'NetComics'
    },
    container: {
        url: 'https://www.netcomics.com/fr/comic/un-certain-genre-de-mariage',
        id: '17892',
        title: 'Un Certain Genre de Mariage'
    },
    child: {
        id: '60443',
        title: '1'
    },
    entry: {
        index: 4,
        size: 120_912,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: English Locale
new TestFixture({
    plugin: {
        id: 'netcomics',
        title: 'NetComics'
    },
    container: {
        url: 'https://www.netcomics.com/en/comic/some-kind-of-marriage',
        id: '17817',
        title: 'Some Kind of Marriage'
    },
    child: {
        id: '54035',
        title: '1'
    },
    entry: {
        index: 4,
        size: 118_616,
        type: 'image/jpeg'
    }
}).AssertWebsite();