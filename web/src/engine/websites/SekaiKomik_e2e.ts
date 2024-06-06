import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sekaikomik',
        title: 'SekaiKomik'
    },
    container: {
        url: 'https://sekaikomik.guru/manga/circles/',
        id: '/manga/circles/',
        title: 'Circles'
    },
    child: {
        id: '/circles-chapter-01/',
        title: 'Chapter 01',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 106_232,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());