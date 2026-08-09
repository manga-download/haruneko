import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-de',
        title: 'NineMangaDE'
    },
    container: {
        url: 'https://de.niadd.com/manga/Tales_of_Demons_and_Gods.html',
        id: '/manga/Tales_of_Demons_and_Gods.html',
        title: 'Tales Of Demons And Gods',
    },
    child: {
        id: '/chapter/Tales_of_Demons_and_Gods_193_5/539331/',
        title: 'Tales of Demons and Gods 193.5', //yes, chapter contains two times manga title, :D
    },
    entry: {
        index: 0,
        size: 467_603,
        type: 'image/jpeg',
    }
}).AssertWebsite();