import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mikoroku',
        title: 'Mikoroku'
    },
    container: {
        url: 'https://www.mikoroku.top/2023/04/the-hero-wants-milf-as-reward.html',
        id: '/2023/04/the-hero-wants-milf-as-reward.html',
        title: 'The Hero Wants a Milf As a Reward'
    },
    child: {
        id: '/2026/03/the-hero-wants-milf-as-reward-chapter-30.html',
        title: 'Chapter 30'
    },
    entry: {
        index: 1,
        size: 41_770,
        type: 'image/jpeg'
    }
}).AssertWebsite();