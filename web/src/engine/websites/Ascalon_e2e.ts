import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ascalon',
        title: 'Ascalon'
    },
    container: {
        url: 'https://ascalonscans.com/manga/i-am-the-servers-adversary/',
        id: '/manga/i-am-the-servers-adversary/',
        title: 'I Am The Server’s Adversary!'
    },
    child: {
        id: '/i-am-the-servers-adversary-chapter-5/',
        title: 'Chapter 05'
    },
    entry: {
        index: 0,
        size: 196_280,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());