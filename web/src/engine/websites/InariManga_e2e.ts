import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'inarimanga',
        title: 'InariManga'
    },
    container: {
        url: 'https://rukavinari.org/manga/la-princesa-quiere-morir-en-paz',
        id: '/manga/la-princesa-quiere-morir-en-paz',
        title: '¡La Princesa Quiere Morir En Paz!'
    },
    child: {
        id: '/la-princesa-quiere-morir-en-paz-capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 5,
        size: 2_403_656,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());