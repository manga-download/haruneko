import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'argosscan',
        title: 'Argos Scan'
    },
    container: {
        url: 'https://argoscomic.com/6b217fc9-6ef8-4708-8e96-2d06e0a78349/o-apocalipse-chegou',
        id: '/6b217fc9-6ef8-4708-8e96-2d06e0a78349/o-apocalipse-chegou',
        title: 'O Apocalipse Chegou',
    },
    child: {
        id: '/6b217fc9-6ef8-4708-8e96-2d06e0a78349/o-apocalipse-chegou/capitulo/9',
        title: 'Capítulo 9',
    },
    entry: {
        index: 1,
        size: 270_536,
        type: 'image/webp'
    }
}).AssertWebsite();