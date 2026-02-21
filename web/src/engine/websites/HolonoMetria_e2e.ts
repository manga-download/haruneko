import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'holonometria',
        title: 'HolonoMetria',
        timeout: 50000
    },
    container: {
        url: 'https://holoearth.com/en/alt/holonometria/manga/vestadecooking/ep0/',
        id: '/en/alt/holonometria/manga/vestadecooking/ep0/',
        title: 'Vesta de Cooking [en]'
    },
    child: {
        id: '/en/alt/holonometria/manga/vestadecooking/ep1/',
        title: '【Chapter 1】'
    },
    entry: {
        index: 5,
        size: 691_742,
        type: 'image/png'
    }
}).AssertWebsite();