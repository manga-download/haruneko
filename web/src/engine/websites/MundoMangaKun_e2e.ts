import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mundomangakun',
        title: 'Mundo Mangá-Kun'
    },
    container: {
        url: 'https://mundomangakun.com.br/manga/a-perverts-daily-life/',
        id: '/manga/a-perverts-daily-life/',
        title: 'A Pervert’s Daily Life'
    },
    child: {
        id: '/a-perverts-daily-life-capitulo/',
        title: 'Capítulo 01',
        timeout : 23000
    },
    entry: {
        index: 1,
        size: 1_036_204,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());