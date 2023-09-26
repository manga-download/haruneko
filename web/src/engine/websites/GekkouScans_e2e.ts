import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gekkouscans',
        title: 'Gekkou Scans'
    },
    container: {
        url: 'https://gekkou.com.br/manga/31ce6cda-3241-11ee-be56-0242ac120002/',
        id: JSON.stringify({ post: '329', slug: '/manga/31ce6cda-3241-11ee-be56-0242ac120002/' }),
        title: 'Sousou no Frieren'
    },
    child: {
        id: '/manga/31ce6cda-3241-11ee-be56-0242ac120002/01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 358_968,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());