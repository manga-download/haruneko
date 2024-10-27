import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'bacakomik',
        title: 'BacaKomik'
    },
    /* Region locked : indonesia
    container: {
        url: 'https://bacakomik.net/komik/tokyo-revengers/',
        id: '/komik/tokyo-revengers/',
        title: 'Tokyo卍Revengers'
    },
    child: {
        id: encodeURI('/chapter/tokyo卍revengers-chapter-1-bahasa-indonesia').toLocaleLowerCase(),
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 243_154,
        type: 'image/jpeg'
    }*/
};

new TestFixture(config).AssertWebsite();