import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangamonarca',
        title: 'Monarcamanga'
    },
    container: {
        url: 'https://visormonarca.com/manga/trabajo-de-nueve-a-cinco-en-el-mundo-del-cultivo-inmortal/',
        id: JSON.stringify({ post: '2758', slug: '/manga/trabajo-de-nueve-a-cinco-en-el-mundo-del-cultivo-inmortal/' }),
        title: 'Trabajo de nueve a cinco en el mundo del cultivo inmortal'
    },
    child: {
        id: '/manga/trabajo-de-nueve-a-cinco-en-el-mundo-del-cultivo-inmortal/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 2,
        size: 512_582,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());