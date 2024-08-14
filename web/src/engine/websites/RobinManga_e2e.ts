import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'robinmanga',
        title: 'RobinManga'
    },
    container: {
        url: 'https://robinmanga.com/manga/i-learn-to-kill-gods-in-an-asylum/',
        id: JSON.stringify({ post: '1636', slug: '/manga/i-learn-to-kill-gods-in-an-asylum/'}),
        title: 'I Learn to Kill Gods in an Asylum'
    },
    child: {
        id: '/manga/i-learn-to-kill-gods-in-an-asylum/chapter-58/',
        title: 'Chapter 58'
    },
    entry: {
        index: 1,
        size: 607_812,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());