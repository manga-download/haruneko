﻿import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'henchan',
        title: 'Хентай-тян! (Hentai-chan)'
    },
    container: {
        url: 'https://hentaichan.live/manga/47092-zhena-privela-podrugu-dlya-muzha-u-kotorogo-ne-vstanet-bez-esche-2-bolshih-sisek-glava-1.html',
        id: '/manga/47092-zhena-privela-podrugu-dlya-muzha-u-kotorogo-ne-vstanet-bez-esche-2-bolshih-sisek-glava-1.html',
        title: 'Жена привела подругу для мужа, у которого не встанет без ещё 2 больших сисек - глава 1'
    },
    child: {
        id: '/online/47092-zhena-privela-podrugu-dlya-muzha-u-kotorogo-ne-vstanet-bez-esche-2-bolshih-sisek-glava-1.html',
        title: 'Жена привела подругу для мужа, у которого не встанет без ещё 2 больших сисек - глава 1'
    },
    entry: {
        index: 0,
        size: 153_676,
        type: 'image/webp'
    }
}).AssertWebsite();