import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'coolmic',
        title: 'CoolMic'
    },
    container: {
        url: 'https://coolmic.me/titles/3346',
        id: '/titles/3346',
        title: 'Infinite Love Glitch'
    },
    child: {
        id: '87395',
        title: '01'
    },
    entry: {
        index: 0,
        size: 151_687,
        type: 'image/jpeg'
    }
}).AssertWebsite();