﻿import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'magusmanga',
        title: 'MagusManga'
    },
    /* CloudFlare
    container: {
        url: 'https://magustoon.com/series/01536939fbb/',
        id: '/series/01536939fbb/',
        title: 'I Became A Level 999 Mastermind Demon King'
    },
    child: {
        id: '/chapter/01536939fbb-b99c3c5ce14/',
        title: 'Chapter 25'
    },
    entry: {
        index: 1,
        size: 784_872,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());