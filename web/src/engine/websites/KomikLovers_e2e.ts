import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'komiklovers',
        title: 'KomiLovers'
    },
    container: {
        url: 'https://komiklovers.com/komik/blade-of-retribution/',
        id: '/komik/blade-of-retribution/',
        title: 'Blade of Retribution'
    },
    child: {
        id: '/blade-of-retribution-chapter-10/',
        title: 'Chapter 10'
    },
    entry: {
        index: 1,
        size: 394_750,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());