import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'pairoftwo',
        title: 'Pair of 2'
    },
    container: {
        url: 'https://po2scans.com/series/blue-lock',
        id: '/series/blue-lock',
        title: 'Blue Lock'
    },
    child: {
        id: '/reader/650f705e2f143',
        title: 'Chapter 234 - Producer'
    },
    entry: {
        index: 0,
        size: 576_438,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());