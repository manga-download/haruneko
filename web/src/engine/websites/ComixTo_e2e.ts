import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comixto',
        title: 'Comix (.to)'
    },
    container: {
        url: 'https://comix.to/title/k7yg7-the-spark-in-your-eyes',
        id: '/title/k7yg7-the-spark-in-your-eyes',
        title: 'The Spark in Your Eyes'
    },
    child: {
        id: '/title/k7yg7-the-spark-in-your-eyes/7271789-chapter-225',
        title: '225'
    },
    entry: {
        index: 0,
        size: 625_234,
        type: 'image/webp'
    }
}).AssertWebsite();