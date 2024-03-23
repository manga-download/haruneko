import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwafreak',
        title: 'ManhwaFreak'
    },
    container: {
        url: 'https://freakcomic.com/manga/i-am-reborn-as-the-sword-master/',
        id: '/manga/i-am-reborn-as-the-sword-master/',
        title: 'I Am Reborn as the Sword Master'
    },
    child: {
        id: '/i-am-reborn-as-the-sword-master-ch-77-hOtrB/',
        title: 'Chapter 77'
    },
    entry: {
        index: 1,
        size: 1_877_931,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());