import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'newtype',
        title: 'NewType'
    },
    container: {
        url: 'https://comic.webnewtype.com/contents/imouto/',
        id: '/contents/imouto/',
        title: '妹に婚約者を取られたら見知らぬ公爵様に求婚されました'
    },
    child: {
        id: '/contents/imouto/10/',
        title: '新刊発売☆おまけ漫画'
    },
    entry: {
        index: 0,
        size: 558_395,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());