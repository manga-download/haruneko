import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'siimanga',
        title: 'SiiManga'
    },
    container: {
        url: 'https://siikomik.com/manga/i-have-90-billion-licking-gold/',
        id: '/manga/i-have-90-billion-licking-gold/',
        title: 'I Have 90 Billion Licking Gold'
    },
    child: {
        id: '/i-have-90-billion-licking-gold-chapter-365/',
        title: 'Chapter 365'
    },
    entry: {
        index: 2,
        size: 268_110,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());