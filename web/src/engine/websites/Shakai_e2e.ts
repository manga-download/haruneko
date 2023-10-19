import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'shakai',
        title: 'Shakai'
    },
    container: {
        url: 'https://shakai.ru/manga/350',
        id: '350',
        title: 'One Piece / Ван Пис',
        timeout: 10000 //api fetch all chapter data, and well, its one piece after all
    },
    child: {
        id: '0_e',
        title: '0_e'
    },
    entry: {
        index: 0,
        size: 839_916,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());