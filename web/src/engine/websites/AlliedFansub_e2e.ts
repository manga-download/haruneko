import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'alliedfansub',
        title: 'Allied Fansub'
    },
    container: {
        url: 'https://alliedfansub.online/manga/love-is-an-illusion/',
        id: '/manga/love-is-an-illusion/',
        title: 'Love Is an Illusion!'
    },
    child: {
        id: '/love-is-an-illusion-bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 54_192,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());