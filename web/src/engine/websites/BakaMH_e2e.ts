import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const mangaName = encodeURI('秘密教学');

const config: Config = {
    plugin: {
        id: 'bakamh',
        title: 'BakaMH',
    },
    container: {
        url: 'https://bakamh.com/manga/秘密教学/',
        id: JSON.stringify({ post: '3037', slug: `/manga/${mangaName}/`}),
        title: '秘密教学',
    },
    child: {
        id: `/manga/${mangaName.toLowerCase()}/c-244/`,
        title: '第244话 对薇亚坦承',
    },
    entry: {
        index: 2,
        size: 452_647,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();