import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hotcomics',
        title: 'HotComics'
    },
    container: {
        url: 'https://hotcomics.io/en/joseon-age-of-ruin/wLM5B1BY.html',
        id: '/en/joseon-age-of-ruin/wLM5B1BY.html',
        title: 'Joseon: Age of Ruin [en]'
    },
    child: {
        id: '/en/joseon-age-of-ruin/episode-1-RoVgwoQB.html',
        title: '1'
    },
    entry: {
        index: 0,
        size: 25_979,
        type: 'image/jpeg'
    }
}).AssertWebsite();