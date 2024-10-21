import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'genztoon',
        title: 'GenzToon'
    }, /* CloudFlare
    container: {
        url: 'https://genzupdates.com/series/7e80e1ac248/',
        id: '/series/7e80e1ac248/',
        title: 'A Bad Person'
    },
    child: {
        id: '/chapter/7e80e1ac248-65380b2e6a1/',
        title: 'Chapter 138'
    },
    entry: {
        index: 0,
        size: 837_140,
        type: 'image/webp'
    } */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());