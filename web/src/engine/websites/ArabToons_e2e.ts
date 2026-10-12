import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'arabtoons',
        title: 'ArabToons'
    },
    container: {
        url: 'https://arabtoons.net/manga/elf-who-likes-to-be-humiliated',
        id: '208/elf-who-likes-to-be-humiliated',
        title: 'Elf Who Likes To Be Humiliated'
    },
    child: {
        id: 'الفصل-71',
        title: '71'
    },
    entry: {
        index: 0,
        size: 445_752,
        type: 'image/webp'
    }
}).AssertWebsite();