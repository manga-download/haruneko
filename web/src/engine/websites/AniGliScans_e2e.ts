import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'anigliscans',
        title: 'Animated Glitched Scans'
    },
    container: {
        url: 'https://anigliscans.xyz/series/ive-been-grinding-inside-a-mirror/',
        id: '/series/ive-been-grinding-inside-a-mirror/',
        title: '“I’ve Been Grinding Inside a Mirror”!'
    },
    child: {
        id: '/ive-been-grinding-inside-a-mirror-chapter-28/',
        title: 'Chapter 28'
    },
    entry: {
        index: 1,
        size: 3_074_708,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());