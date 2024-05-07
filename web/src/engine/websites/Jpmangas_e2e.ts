import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'jpmangas',
        title: 'Jpmangas'
    },
    container: {
        url: 'https://jpmangas.xyz/manga/100-gokuama-kareshi',
        id: '/manga/100-gokuama-kareshi',
        title: '100% Gokuama Kareshi!'
    },
    child: {
        id: '/manga/100-gokuama-kareshi/1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 86_266,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());