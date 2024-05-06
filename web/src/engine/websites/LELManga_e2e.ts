import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lelmanga',
        title: 'LELManga'
    },
    container: {
        url: 'https://www.lelmanga.com/manga/jujutsu-kaisen',
        id: '/manga/jujutsu-kaisen',
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/jujutsu-kaisen-1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 0,
        size: 614_256,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());