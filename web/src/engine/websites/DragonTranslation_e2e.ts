import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'dragontranslation',
        title: 'DragonTranslation'
    },
    container: {
        url: 'https://dragontranslation.net/manga/tissue-thief',
        id: '/manga/tissue-thief',
        title: 'Tissue Thief'
    },
    child: {
        id: '/leer/tissue-thief-1.00',
        title: 'Capitulo 1.00'
    },
    entry: {
        index: 1,
        size: 82_768,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());