import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'aquamanga',
        title: 'AquaManga'
    },
    container: {
        url: 'https://aquareader.net/manga/another-beginning-with-the-guhuo-bird/',
        id: JSON.stringify({post: '2601', slug: '/manga/another-beginning-with-the-guhuo-bird/'}),
        title: 'Another beginning with the Guhuo bird'
    },
    child: {
        id: '/manga/another-beginning-with-the-guhuo-bird/another-beginning-with-the-guhuo-bird/ch-242-chapter-242/',
        title: 'Ch. 242 - Chapter 242'
    },
    entry: {
        index: 0,
        size: 38_586,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());