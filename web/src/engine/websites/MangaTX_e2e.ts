import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangatx',
        title: 'MangaTX'
    },
    container: {
        url: 'https://mangatx.to/manhua/the-10th-class-lout-of-the-knight-family-all-chapters/',
        id: JSON.stringify({ post: '1690', slug: '/manhua/the-10th-class-lout-of-the-knight-family-all-chapters/'}),
        title: 'The 10th Class Lout of the Knight Family'
    },
    child: {
        id: '/manhua/the-10th-class-lout-of-the-knight-family-all-chapters/chapter-20/',
        title: 'Chapter 20'
    },
    entry: {
        index: 1,
        size: 465_941,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());