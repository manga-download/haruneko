import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kirascans',
        title: 'Kira Scans'
    },
    container: {
        url: 'https://kirascans.com/manga/drug-devourer/',
        id: '/manga/drug-devourer/',
        title: 'Drug Devourer'
    },
    child: {
        id: '/drug-devourer-chapter-123/',
        title: 'Chapter 123'
    },
    entry: {
        index: 0,
        size: 928_781,
        type: 'image/jpeg'
    }
}).AssertWebsite();