import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dragontranslation',
        title: 'DragonTranslation'
    },
    container: {
        url: 'https://dragontranslation.org/manga/tissue-thief/',
        id: JSON.stringify({ post: '2146', slug: '/manga/tissue-thief/' }),
        title: 'Tissue Thief'
    },
    child: {
        id: '/manga/tissue-thief/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 1,
        size: 67_683,
        type: 'image/jpeg'
    }
}).AssertWebsite();