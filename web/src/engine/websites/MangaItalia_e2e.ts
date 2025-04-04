﻿import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga-italia',
        title: 'Manga Italia'
    },
    container: {
        url: 'https://mangaita.io/manga/4-cut-hero',
        id: '/manga/4-cut-hero',
        title: '4 Cut Hero'
    },
    child: {
        id: '/scan/26099',
        title: 'Capitolo 52'
    },
    entry: {
        index: 1,
        size: 31_568,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();