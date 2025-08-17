﻿import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'infrafandub',
        title: 'Infra Fandub'
    },
    container: {
        url: 'https://infrafandub.com/manga/tribu-de-dios/',
        id: JSON.stringify({ slug: '/manga/tribu-de-dios/' }),
        title: 'Tribu de dios'
    },
    child: {
        id: '/manga/tribu-de-dios/capitulo-48/',
        title: 'Capitulo 48'
    },
    entry: {
        index: 1,
        size: 1_195_138,
        type: 'image/jpeg'
    }
}).AssertWebsite();