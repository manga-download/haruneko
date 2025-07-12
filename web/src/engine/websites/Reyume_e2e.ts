import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'reyume',
        title: 'Reyume',
    },
    container: {
        url: 'https://www.re-yume.my.id/2024/08/please-behave-my-wife.html',
        id: '/2024/08/please-behave-my-wife.html',
        title: 'Please Behave, My Wife'
    },
    child: {
        id: '/2024/11/please-behave-my-wife-chapter-70-end-s1.html',
        title: 'Chapter 70 - End S1'
    },
    entry: {
        index: 0,
        size: 1_149_074,
        type: 'image/jpeg'
    }
}).AssertWebsite();