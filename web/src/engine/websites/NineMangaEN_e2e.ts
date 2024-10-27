import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ninemanga-en',
        title: 'NineMangaEN'
    },
    container: {
        url: 'https://en.ninemanga.com/manga/My+Angel+Childhood+Friend+was+a+Gal+When+We+Met+Again.html',
        id: '/manga/My+Angel+Childhood+Friend+was+a+Gal+When+We+Met+Again.html',
        title: 'My Angel Childhood Friend was a Gal When We Met Again',
    },
    child: {
        id: '/chapter/My%20Angel%20Childhood%20Friend%20was%20a%20Gal%20When%20We%20Met%20Again/8875625.html',
        title: 'Chapter 14',
    },
    entry: {
        index: 1,
        size: 203_785,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();