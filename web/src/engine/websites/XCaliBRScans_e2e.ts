import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'xcalibrscans',
        title: 'xCaliBR Scans'
    },
    container: {
        url: 'https://xcalibrscans.com/webcomics/manga/above-ten-thousand-people/',
        id: '/webcomics/manga/above-ten-thousand-people/',
        title: 'Above Ten Thousand'
    },
    child: {
        id: '/above-ten-thousand-people-chapter-175/',
        title: 'Chapter 175',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 5_771_072,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());