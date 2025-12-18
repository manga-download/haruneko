import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-de',
        title: 'NineMangaDE'
    },
    container: {
        url: 'https://de.ninemanga.com/manga/Tales+of+Demons+and+Gods.html',
        id: '/manga/Tales+of+Demons+and+Gods.html',
        title: 'Tales of Demons and Gods',
    },
    child: {
        id: '/chapter/Tales%20of%20Demons%20and%20Gods/539331.html',
        title: 'Tales of Demons and Gods 193.5', //yes, chapter contains two times manga title, :D
    },
    entry: {
        index: 0,
        size: 467_603,
        type: 'image/jpeg',
    }
}).AssertWebsite();