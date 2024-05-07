import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yuriverso',
        title: 'Yuri Verso'
    },
    container: {
        url: 'https://yuri.live/manga/life-is-strange-dust/',
        id: JSON.stringify({ post: '3032', slug: '/manga/life-is-strange-dust/' }),
        title: 'Life is Strange -Dust-'
    },
    child: {
        id: '/manga/life-is-strange-dust/capitulo-01/',
        title: 'Capítulo #01'
    },
    entry: {
        index: 0,
        size: 838_042,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());