import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'readcomiconline',
        title: 'ReadComicOnline'
    },
    container: {
        url: 'https://readcomiconline.li/Comic/Star-Wars-Legacy-War',
        id: '/Comic/Star-Wars-Legacy-War',
        title: 'Star Wars: Legacy War'
    }, /* CloudFlare
    child: {
        id: '/Comic/Star-Wars-Legacy-War/Issue-1?id=77062&readType=1&quality=hq',
        title: 'Issue #1',
        timeout: 35000
    },
    entry: {
        index: 0,
        size: 1_312_286,
        type: 'image/jpeg'
    } */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());