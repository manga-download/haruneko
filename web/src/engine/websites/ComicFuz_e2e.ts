﻿import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicfuz',
        title: 'COMIC FUZ'
    },
    container: {
        url: 'https://comic-fuz.com/manga/806',
        id: '806',
        title: '軍神ちゃんとよばないで'
    },
    child: {
        id: '12408',
        title: '１巻 第１話 虎千代登場'
    },
    entry: {
        index: 0,
        size: 747_391,
        type: 'image/jpeg'
    }
}).AssertWebsite();