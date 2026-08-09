import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mikoroku',
        title: 'Mikoroku'
    },
    container: {
        url: 'https://mikoroku.com/detail?slug=the-hero-wants-a-milf-as-a-reward',
        id: 'the-hero-wants-a-milf-as-a-reward',
        title: 'The Hero Wants a Milf As a Reward'
    },
    child: {
        id: JSON.stringify({ url: 'https://www.mikodrive.my.id/2026/03/the-hero-wants-milf-as-reward-chapter-30.html', slug: 'the-hero-wants-milf-as-reward-chapter-30'}),
        title: 'Chapter 30'
    },
    entry: {
        index: 1,
        size: 41_770,
        type: 'image/jpeg'
    }
}).AssertWebsite();