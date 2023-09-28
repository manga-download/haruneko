import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scambertraslator',
        title: 'ScamberTraslator'
    },
    container: {
        url: 'https://scambertraslator.com/manga/evolucion-del-esqueleto-de-otro-mundo/',
        id: JSON.stringify({ post: '2256', slug: '/manga/evolucion-del-esqueleto-de-otro-mundo/' }),
        title: 'Evolución del esqueleto de otro mundo'
    },
    child: {
        id: '/manga/evolucion-del-esqueleto-de-otro-mundo/capitulo-00/',
        title: 'capitulo 00'
    },
    entry: {
        index: 1,
        size: 167_094,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());