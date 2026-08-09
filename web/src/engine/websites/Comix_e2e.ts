import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comix',
        title: 'Comix'
    },
    container: {
        url: 'https://comix.to/title/k7yg7-the-spark-in-your-eyes',
        id: '/title/k7yg7-the-spark-in-your-eyes',
        title: 'The Spark in Your Eyes'
    },
    child: {
        id: '/title/k7yg7-the-spark-in-your-eyes/2536461-chapter-66',
        title: '66 - The Period of Humans (4) [UToon]'
    },
    entry: {
        index: 0,
        size: 678_370,
        type: 'image/webp'
    }
}).AssertWebsite();