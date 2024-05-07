import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'reaperscansbr',
        title: 'Reaper Scans (Portuguese)',
    },
    container: {
        url: 'https://reaperscans.net/series/me-escolhe-1699398000238',
        id: '/series/me-escolhe-1699398000238',
        title: 'Me Escolhe!'
    },
    child: {
        id: '/chapter/me-escolhe-1699398000238/capitulo-56',
        title: 'Capítulo 56',
    },
    entry: {
        index: 1,
        size: 3_049_425,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());