import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tecnoscan',
        title: 'Tecno Scan'
    },
    container: {
        url: 'https://visortecno.com/manga/fuego-en-la-oscuridad/',
        id: JSON.stringify({ post: '2191', slug: '/manga/fuego-en-la-oscuridad/' }),
        title: 'Fuego en la oscuridad'
    },
    child: {
        id: '/manga/fuego-en-la-oscuridad/capitulo-1/',
        title: 'Capítulo 1',
    },
    entry: {
        index: 0,
        size: 843_966,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());