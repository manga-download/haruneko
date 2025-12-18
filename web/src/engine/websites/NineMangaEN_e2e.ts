import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-en',
        title: 'NineMangaEN'
    },
    container: {
        url: 'https://www.ninemanga.com/manga/My+Angel+Childhood+Friend+was+a+Gal+When+We+Met+Again.html',
        id: '/manga/My+Angel+Childhood+Friend+was+a+Gal+When+We+Met+Again.html',
        title: 'My Angel Childhood Friend was a Gal When We Met Again',
    },
    child: {
        id: '/chapter/My%20Angel%20Childhood%20Friend%20was%20a%20Gal%20When%20We%20Met%20Again/9455239.html',
        title: 'Chapter 14',
    },
    entry: {
        index: 1,
        size: 94_250,
        type: 'image/webp'
    }
}).AssertWebsite();