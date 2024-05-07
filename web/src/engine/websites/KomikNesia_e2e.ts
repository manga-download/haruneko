import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'komiknesia',
        title: 'KomikNesia'
    },
    container: {
        url: 'https://komiknesia.xyz/manga/ulzzang-generation/',
        id: '/manga/ulzzang-generation/',
        title: 'Ulzzang Generation'
    },
    child: {
        id: '/ulzzang-generation-chapter-34/',
        title: 'Chapter 34'
    },
    entry: {
        index: 1,
        size: 514_074,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());