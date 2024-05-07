import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comiczerosum',
        title: 'Comic ゼロサム (Comic ZEROSUM)'
    },
    container: {
        url: 'https://zerosumonline.com/detail/imoutoni',
        id: 'imoutoni',
        title: '妹に婚約者を取られたら、獣な王子に求婚されました～またたびとして溺愛されてます～'
    },
    child: {
        id: '284',
        title: '第1章'
    },
    entry: {
        index: 0,
        size: 197_894,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());