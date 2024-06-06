import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangacrab',
        title: 'Manga Crab'
    },
    container: {
        url: 'https://wikicrab.xyz/series/mi-sistema-es-muy-serio/',
        id: JSON.stringify({ post: '30840', slug: '/series/mi-sistema-es-muy-serio/' }),
        title: 'Mi Sistema Es Muy serio'
    },
    child: {
        id: '/series/mi-sistema-es-muy-serio/capitulo-19/',
        title: 'Capitulo 19'
    },
    entry: {
        index: 1,
        size: 769_088,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());