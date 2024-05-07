import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangagezgini',
        title: 'Manga Gezgini'
    },
    container: {
        url: 'https://mangagezgini.com/manga/i-became-a-knight-with-a-time-limit/',
        id: JSON.stringify({ post: '22449', slug: '/manga/i-became-a-knight-with-a-time-limit/' }),
        title: 'I Became a Knight With a Time Limit'
    },
    child: {
        id: '/manga/i-became-a-knight-with-a-time-limit/bolum-0/',
        title: 'Bölüm 0'
    },
    entry: {
        index: 1,
        size: 2_719_158,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());