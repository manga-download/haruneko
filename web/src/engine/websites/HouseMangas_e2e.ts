import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'housemangas',
        title: 'HouseMangas'
    },
    container: {
        url: 'https://housemangas.com/manga/todos-los-talentos-futbolisticos-son-mios/',
        id: JSON.stringify({ post: '3589', slug: '/manga/todos-los-talentos-futbolisticos-son-mios/' }),
        title: 'Todos los talentos futbolísticos son míos'
    },
    child: {
        id: '/manga/todos-los-talentos-futbolisticos-son-mios/capitulo-30/',
        title: 'Capitulo 30'
    },
    entry: {
        index: 0,
        size: 155_990,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());