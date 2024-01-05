import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangaschan',
        title: 'Mangás Chan'
    },
    container: {
        url: 'https://mangaschan.net/manga/the-beginning-after-the-end/',
        id: '/manga/the-beginning-after-the-end/',
        title: 'The Beginning After The End'
    },
    child: {
        id: '/the-beginning-after-the-end-capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 154_364,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());