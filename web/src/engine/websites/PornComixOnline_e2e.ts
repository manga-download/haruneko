import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'porncomixonline',
        title: 'PornComix Online'
    },
    container: {
        url: 'https://porncomix.online/comic/yuki-space-assassin-fear-and-loathing-in-asmodaeva/',
        id: JSON.stringify({ post: '6222702', slug: '/comic/yuki-space-assassin-fear-and-loathing-in-asmodaeva/' }),
        title: 'Space Assassin Fear'
    },
    child: {
        id: '/comic/yuki-space-assassin-fear-and-loathing-in-asmodaeva/yuki-space-assassin-fear-and-loathing-in-asmodaeva/',
        title: 'Yuki -Space Assassin Fear and Loathing in Asmodaeva'
    },
    entry: {
        index: 0,
        size: 613_984,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();