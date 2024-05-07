import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'stellarsaber',
        title: 'Stellar Saber'
    },
    container: {
        url: 'https://stellarsaber.pro/manga/jujutsu-kaisen/',
        id: '/manga/jujutsu-kaisen/',
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/jujutsu-kaisen-%d8%a7%d9%84%d9%81%d8%b5%d9%84-249/',
        title: 'Chapter 249'
    },
    entry: {
        index: 0,
        size: 1_498_400,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());