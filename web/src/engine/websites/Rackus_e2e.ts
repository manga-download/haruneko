import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'rackus',
        title: 'Rackus'
    },
    container: {
        url: 'https://rackusreads.com/manga/the-female-lead-acquires-cheat-skills/',
        id: JSON.stringify({ post: '101', slug: '/manga/the-female-lead-acquires-cheat-skills/' }),
        title: 'The Female Lead Acquires Cheat Skills'
    },
    child: {
        id: '/manga/the-female-lead-acquires-cheat-skills/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 719_764,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());