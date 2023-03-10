import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'modescanlator',
        title: 'Mode Scanlator'
    },
    container: {
        url: 'https://modescanlator.com/manga/eternal-first-son-in-law/',
        id: '/manga/eternal-first-son-in-law/',
        title: 'Eternal First Son-In-Law',
    },
    child: {
        id: '/eternal-first-son-in-law-capitulo-277/',
        title: 'Capítulo 277',
    },
    entry: {
        index: 0,
        size: 951_458,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());