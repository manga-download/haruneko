import { TestFixture } from '../../../test/WebsitesFixture';

const ComicConfig = {
    plugin: {
        id: 'templescan',
        title: 'TempleScan'
    },
    container: {
        url: 'https://templescan.net/comic/predatory-marriage-complete-edition',
        id: JSON.stringify({ id: '55', slug: 'predatory-marriage-complete-edition' }),
        title: `Predatory Marriage (Complete Edition)`
    },
    child: {
        id: JSON.stringify({ id: '1028', slug: '83662-chapter-15' }),
        title: 'Chapter 15'
    },
    entry: {
        index: 0,
        size: 2_953_394,
        type: 'image/jpeg'
    }
};

const ComicFixture = new TestFixture(ComicConfig);
describe(ComicFixture.Name, () => ComicFixture.AssertWebsite());