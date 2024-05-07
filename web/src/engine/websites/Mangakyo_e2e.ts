import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangakyo',
        title: 'Mangakyo'
    },
    container: {
        url: 'https://mangakyo.vip/komik/0-magic-a-high-spirit-and-a-demonic-sword/',
        id: '/komik/0-magic-a-high-spirit-and-a-demonic-sword/',
        title: '0 Magic, a High Spirit, and a Demonic Sword'
    },
    child: {
        id: '/0-magic-a-high-spirit-and-a-demonic-sword-chapter-01/',
        title: 'Chapter 01',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 84_767,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());