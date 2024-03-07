﻿import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'shinigamiid',
        title: 'Shinigami ID',
    },
    /* CloudFlare
    container: {
        url: 'https://shinigami.cx/series/sss-class-suicide-hunter/',
        id: JSON.stringify({ post: "641", slug: "/series/sss-class-suicide-hunter/" }),
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

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());