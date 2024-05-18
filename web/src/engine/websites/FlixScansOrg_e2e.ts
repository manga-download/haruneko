import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'flixscansorg',
        title: 'FlixScans (.org)'
    },
    container: {
        url: 'https://flixscans.org/series/83037-37-the-greatest-estate-developer',
        id: JSON.stringify({ id: 37, prefix: 83037 }),
        title: 'The Greatest Estate Developer'
    },
    child: {
        id: '3346',
        title: '134'
    },
    entry: {
        index: 0,
        size: 707_990,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());