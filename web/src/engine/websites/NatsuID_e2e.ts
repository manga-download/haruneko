import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'natsuid',
        title: 'NatsuID'
    },
    container: {
        url: 'https://natsu.id/manga/99-reinforced-wooden-stick/',
        id: '/manga/99-reinforced-wooden-stick/',
        title: '+99 Reinforced Wooden Stick'
    },
    child: {
        id: '/99-reinforced-wooden-stick-chapter-133/',
        title: 'Chapter 133'
    },
    entry: {
        index: 1,
        size: 132_617,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());