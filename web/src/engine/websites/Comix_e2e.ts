import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comix',
        title: 'Comix'
    },
    container: {
        url: 'https://comix.to/title/k7yg7-the-spark-in-your-eyes',
        id: '/title/k7yg7-the-spark-in-your-eyes',
        title: 'The Spark in Your Eyes',
        timeout: 15_000
    },
    child: {
        id: '/title/k7yg7-the-spark-in-your-eyes/2536461-chapter-66',
        title: '66 - The Period of Humans (4) [UToon]',
        timeout: 15_000
    },
    entry: {
        index: 1,
        size: 254_320,
        type: 'image/webp'
    }
}).AssertWebsite();