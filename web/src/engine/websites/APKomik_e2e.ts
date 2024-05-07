import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'apkomik',
        title: 'APKomik'
    }/* CloudFlare,
    container: {
        url: 'https://apkomik.cc/manga/a-bad-person/',
        id: '/manga/a-bad-person/',
        title: 'A Bad Person (Bad Guy)'
    },
    child: {
        id: '/a-bad-person-chapter-01-bahasa-indonesia/',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 172_827,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());