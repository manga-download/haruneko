import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'allporncomic',
        title: 'AllPornComic'
    },
    container: {
        url: 'https://allporncomic.com/porncomic/this-doesnt-feel-like-me-andromeda-11/',
        id: JSON.stringify({ post: '3049', slug: '/porncomic/this-doesnt-feel-like-me-andromeda-11/' }),
        title: 'This Doesn’t Feel Like Me [Andromeda 11]'
    },
    child: {
        id: '/porncomic/this-doesnt-feel-like-me-andromeda-11/chapter-001/',
        title: 'Chapter 001'
    },
    entry: {
        index: 0,
        size: 52_384,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());