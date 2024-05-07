import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwax',
        title: 'Manhwax'
    },
    container: {
        url: 'https://manhwax.org/manga/amagami-san-chi-no-enmusubi/',
        id: '/manga/amagami-san-chi-no-enmusubi/',
        title: 'Amagami-San Chi No Enmusubi'
    },
    child: {
        id: '/amagami-san-chi-no-enmusubi-chapter-1-english/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 108_063,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());