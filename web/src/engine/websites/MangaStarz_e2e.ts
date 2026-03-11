import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangastarz',
        title: 'مانجا ستارز (Mangastarz)'
    },
    container: {
        url: 'https://manga-starz.net/manga/getter-robo-go/',
        id: JSON.stringify({ post: '82737', slug: '/manga/getter-robo-go/' }),
        title: 'Getter Robo Go'
    },
    child: {
        id: '/manga/getter-robo-go/1/',
        title: '1'
    },
    entry: {
        index: 0,
        size: 358_957,
        type: 'image/jpeg'
    }
}).AssertWebsite();