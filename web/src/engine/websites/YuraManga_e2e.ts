import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'yuramanga',
        title: 'YuraManga'
    },
    container: {
        url: 'https://yuramanga.my.id/manga/district-12/',
        id: JSON.stringify({ post: '2130', slug: '/manga/district-12/' }),
        title: 'District 12'
    },
    child: {
        id: '/manga/district-12/chapter-6/',
        title: 'Chapter 6'
    },
    entry: {
        index: 1,
        size: 1_637_152,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());