import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'instamanhwa',
        title: 'InstaManhwa'
    },
    container: {
        url: 'https://www.instamanhwa.com/manga/am-i-the-daughter',
        id: JSON.stringify({ post: '1276', slug: '/manga/am-i-the-daughter' }),
        title: 'Am I the Daughter?'
    },
    child: {
        id: '/manga/am-i-the-daughter/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 160_654,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());