import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'amuyscan',
        title: 'AmuyScan'
    },
    container: {
        url: 'https://apenasmaisumyaoi.com/manga/meurei/',
        id: JSON.stringify({ post: '200', slug: '/manga/meurei/' }),
        title: 'Até Logo, Meu Rei'
    },
    child: {
        id: '/manga/meurei/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 2_511_272,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());