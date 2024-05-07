import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'bacakomik',
        title: 'BacaKomik'
    },
    container: {
        url: 'https://bacakomik.me/komik/tokyo-revengers/',
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
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());