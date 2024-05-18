import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manhastro',
        title: 'ManHastro'
    },
    container: {
        url: 'https://manhastro.com/lermanga/yohan-loves-tite/',
        id: JSON.stringify({ post: '47401', slug: '/lermanga/yohan-loves-tite/'}),
        title: 'Yohan Loves Tite'
    },
    child: {
        id: '/lermanga/yohan-loves-tite/capitulo-9/',
        title: 'Capitulo 9'
    },
    entry: {
        index: 2,
        size: 2_176,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());