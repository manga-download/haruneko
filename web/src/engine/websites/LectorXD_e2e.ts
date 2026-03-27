import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lectorxd',
        title: 'LectorXD'
    },
    container: {
        url: 'https://lectorxd.com/manhua/mygirlfriendisazombie',
        id: '/manhua/mygirlfriendisazombie',
        title: 'My Girlfriend is a Zombie'
    },
    child: {
        id: '/manhua/mygirlfriendisazombie/leer/241',
        title: 'Capítulo 241'
    },
    entry: {
        index: 2,
        size: 25_654,
        type: 'image/webp'
    }
}).AssertWebsite();