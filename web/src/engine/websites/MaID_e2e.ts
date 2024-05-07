import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'maid',
        title: 'MAID'
    },
    container: {
        url: 'https://www.maid.my.id/manga/maria-no-danzai/',
        id: '/manga/maria-no-danzai/',
        title: 'Maria no Danzai'
    },
    child: {
        id: '/maria-no-danzai-chapter-01-bahasa-indonesia/',
        title: 'Chapter 01'
    },
    entry: {
        index: 2,
        size: 295_836,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());