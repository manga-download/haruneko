import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'xoxocomics',
        title: 'XoxoComics'
    },
    container: {
        url: 'https://xoxocomic.com/comic/largo-winch',
        id: '/comic/largo-winch',
        title: 'Largo Winch'
    },
    child: {
        id: '/comic/largo-winch/issue-20/all',
        title: 'Issue #20'
    },
    entry: {
        index: 0,
        size: 189_375,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());