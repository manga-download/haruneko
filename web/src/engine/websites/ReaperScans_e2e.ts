import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'reaperscans',
        title: 'Reaper Scans'
    },
    container: {
        url: 'https://reaperscans.com/comics/7833-990k-ex-life-hunter',
        id: '/comics/7833-990k-ex-life-hunter',
        title: '990k Ex-Life Hunter',
        timeout: 20000
    },
    child: {
        id: '/comics/7833-990k-ex-life-hunter/chapters/49372236-chapter-74',
        title: 'Chapter 74',
        timeout: 20000

    },
    entry: {
        index: 1,
        size: 1_855_033,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());