﻿import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'shinigamiid',
        title: 'Shinigami ID',
    },
    /* Cloudflare
    container: {
        url: 'https://shinigami08.com/series/sss-class-suicide-hunter/',
        id: JSON.stringify({ post: '641', slug: '/series/sss-class-suicide-hunter/' }),
        title: 'SSS-Class Suicide Hunter'
    },
    child: {
        id: '/series/sss-class-suicide-hunter/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 894_830,
        type: 'image/jpeg'
    }*/
};

new TestFixture(config).AssertWebsite();