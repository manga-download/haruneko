import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'leryaoi',
        title: 'LerYaoi'
    },
    container: {
        url: 'https://leryaoi.com/bl/jinx/',
        id: JSON.stringify({ post: '302', slug: '/bl/jinx/' }),
        title: 'Jinx'
    },
    child: {
        id: '/bl/jinx/capitulo-41/',
        title: 'Capítulo 41'
    },
    entry: {
        index: 0,
        size: 1_407_182,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());