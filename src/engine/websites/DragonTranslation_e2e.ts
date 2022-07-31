import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'dragontranslation',
        title: 'DragonTranslation'
    },
    container: {
        url: 'https://dragontranslation.com/manga/tissue-thief/',
        id: JSON.stringify({ post: '3736', slug: '/manga/tissue-thief/' }),
        title: 'Tissue Thief'
    },
    child: {
        id: '/manga/tissue-thief/capitulo-1-00/',
        title: 'Capítulo 1.00'
    },
    entry: {
        index: 1,
        size: 98_236,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());