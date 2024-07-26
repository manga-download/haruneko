import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'corocoro',
        title: 'CoroCoro Online (コロコロオンライン)'
    },
    container: {
        url: 'https://www.corocoro.jp/episode/10044607041237230924',
        id: '/episode/10044607041237230924',
        title: 'ぷにるはかわいいスライム'
    },
    child: {
        id: '/episode/10044607041237230924',
        title: '[番外編⑪]'
    },
    entry: {
        index: 0,
        size: 2_014_202,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());