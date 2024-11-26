import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mintmanga',
        title: 'MintManga'
    },
    container: {
        url: 'https://2.mintmanga.one/blagoslovenie_nebojitelei__A3b0f6',
        id: '/blagoslovenie_nebojitelei__A3b0f6',
        title: 'Благословение небожителей',
    }, /* Need to be logged, and chapter link change with user id anyway
    child: {
        id: '/blagoslovenie_nebojitelei__A3b0f67/vol8/98?mtr=1',
        title: '8 - 98 Кто прав, кто виноват',
        timeout: 50000

    },
    entry: {
        index: 0,
        size: 3_678_062,
        type: 'image/png'
    }*/
};

new TestFixture(config).AssertWebsite();