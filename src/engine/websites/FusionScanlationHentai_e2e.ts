import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fusionscanlation-hentai',
        title: 'H Fusion Scanlation'
    },
    container: {
        url: 'https://h.fusionscanlation.com/manga/floor-noise/',
        id: JSON.stringify({ post: '2193', slug: '/manga/floor-noise/' }),
        title: 'Floor Noise'
    },
    child: {
        id: '/manga/floor-noise/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 134_782,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());