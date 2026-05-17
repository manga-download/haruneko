import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'vihentai',
        title: 'Vi-Hentai'
    },
    container: {
        url: 'https://vi-hentai.moe/truyen/come-vent-your-frustration-on-me',
        id: '/truyen/come-vent-your-frustration-on-me',
        title: 'Come Vent Your Frustration on Me'
    },
    child: {
        id: '/truyen/come-vent-your-frustration-on-me/oneshot',
        title: 'Oneshot'
    },
    entry: {
        index: 0,
        size: 1_668_015,
        type: 'image/png'
    }
}).AssertWebsite();