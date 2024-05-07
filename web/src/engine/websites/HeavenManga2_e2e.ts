import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'heavenmanga2',
        title: 'HeavenManga'
    },
    container: {
        url: 'https://heavenmanga.com/manga/black-clover',
        id: '/manga/black-clover',
        title: 'Black Clover'
    },
    child: {
        id: '/manga/leer/122619',
        title: 'Chapter 333'
    },
    entry: {
        index: 0,
        size: 1_055_197,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());