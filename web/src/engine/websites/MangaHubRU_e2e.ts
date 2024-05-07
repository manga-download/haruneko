import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangahubru',
        title: 'MangaHub.ru'
    },
    container: {
        url: 'https://mangahub.ru/title/soul_land_ii',
        id: '/title/soul_land_ii',
        title: 'Боевой Континент 2'
    },
    child: {
        id: '/read/539184',
        title: 'Том 1. Глава 310 - Рождение духовного клинка энергии жизни'
    },
    entry: {
        index: 0,
        size: 179_153,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());