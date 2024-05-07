import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangabuddy',
        title: 'MangaBuddy'
    },
    container: {
        url: 'https://mangabuddy.com/this-world-is-mine',
        id: '/this-world-is-mine',
        title: 'This World is Mine'
    },
    child: {
        id: '/this-world-is-mine/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 187_647,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());