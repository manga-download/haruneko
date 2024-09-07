﻿import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'thunderscans',
        title: 'ThunderScans'
    },
    /* CloudFlare
    container: {
        url: 'https://en-thunderscans.com/comics/asura/',
        id: '/comics/asura/',
        title: 'Asura'
    },
    child: {
        id: '/asura-chapter-11/',
        title: 'Chaper 11'
    },
    entry: {
        index: 0,
        size: 408_328,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());