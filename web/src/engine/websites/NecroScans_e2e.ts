import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'necroscans',
        title: 'Necro Scans'
    }, /* CloudFlare
    container: {
        url: 'https://necroscans.com/series/3b846611bce/',
        id: '/series/3b846611bce/',
        title: `The Count's Secret Maid`
    },
    child: {
        id: '/chapter/3b846611bce-e1112cb0198/',
        title: 'Chapter 6'
    },
    entry: {
        index: 0,
        size: 739_042,
        type: 'image/webp'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());