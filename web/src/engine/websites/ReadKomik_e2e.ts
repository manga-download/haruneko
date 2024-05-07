import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'readkomik',
        title: 'ReadKomik'
    },
    container: {
        url: 'https://rkreader.org/archives/manga/superhuman-battlefield/',
        id: '/archives/manga/superhuman-battlefield/',
        title: 'Superhuman Battlefield'
    },
    child: {
        id: '/shb-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 77_262,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());