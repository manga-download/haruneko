import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'soulscans',
        title: 'Soul Scans'
    },
    container: {
        url: 'https://soulscans.my.id/manga/i-have-90-billion-licking-gold/',
        id: '/manga/i-have-90-billion-licking-gold/',
        title: 'I Have 90 Billion Licking Gold'
    },
    child: {
        id: '/i-have-90-billion-licking-gold-chapter-36/',
        title: 'Chapter 36',
        timeout: 15000
    },
    entry: {
        index: 1,
        size: 322_659,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());