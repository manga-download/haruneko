import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'bacakomik',
        title: 'BacaKomik'
    },
    container: {
        url: 'https://bacakomik.my/komik/tokyo卍revengers/',
        id: encodeURI('/komik/tokyo卍revengers/'),
        title: 'Tokyo卍Revengers'
    },
    child: {
        id: encodeURI('/tokyo卍revengers-chapter-1/').toLowerCase(),
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 243_154,
        type: 'image/jpeg'
    }
}).AssertWebsite();