import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'doujinmitai',
        title: 'DoujinMitai'
    },
    container: {
        url: 'https://doujinmitai.com/manga/sexercise/',
        id: '/manga/sexercise/',
        title: 'Sexercise'
    },
    child: {
        id: '/sexercise-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 1_855_101,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());