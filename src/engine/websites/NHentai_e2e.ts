import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture ({
    plugin: {
        id: 'nhentai',
        title: 'NHentai'
    },
    container: {
        url: 'https://nhentai.net/g/514707/',
        id: '/g/514707/',
        title: '[PowderSkin (Uraharukon)] Ichimotsu ga Aru inHose [Digital]'
    },
    child: {
        id: '/g/514707/',
        title: '[PowderSkin (Uraharukon)] Ichimotsu ga Aru inHose [Digital]'
    },
    entry: {
        index: 1,
        size: 152_501,
        type: 'image/jpeg'
    }
}).AssertWebsite();