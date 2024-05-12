import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yumekomik',
        title: 'YumeKomik'
    },
    container: {
        url: 'https://yumekomik.com/manga/scary-campus-college-university/',
        id: '/manga/scary-campus-college-university/',
        title: 'Scary Campus College University'
    },
    child: {
        id: '/scary-campus-college-university-chapter-20-bahasa-indonesia/',
        title: 'Chapter 20'
    },
    entry: {
        index: 1,
        size: 940_825,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());