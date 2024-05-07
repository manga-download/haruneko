import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'monochromescans',
        title: 'Monochrome Scans'
    },
    container: {
        url: 'https://manga.d34d.one/manga/5eac2f24-37ed-4807-b1a7-37f4b9a3fedc',
        id: '5eac2f24-37ed-4807-b1a7-37f4b9a3fedc',
        title: 'Ah! My Job-hunting Goddess',
    },
    child: {
        id: 'b0997c88-1b72-47d6-99b9-6ff40a43c7c0',
        title: 'Volume 1 Chapter 8 - The Eighth Company - A Goddess\'s Prayer',
    },
    entry: {
        index: 1,
        size: 264_727,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());