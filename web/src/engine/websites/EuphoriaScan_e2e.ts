import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'euphoriascan',
        title: 'Euphoria Scan'
    },
    container: {
        url: 'https://yaoisbls.com.br/manga/19-days-mob/',
        id: JSON.stringify({ post: '128', slug: '/manga/19-days-mob/' }),
        title: '19 days mob'
    },
    child: {
        id: '/manga/19-days-mob/capitulo-unico/',
        title: 'Capítulo único'
    },
    entry: {
        index: 0,
        size: 333_638,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());