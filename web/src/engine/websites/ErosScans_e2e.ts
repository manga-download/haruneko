﻿import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'erosscans',
        title: 'Eros Scans'
    },
    container: {
        url: 'https://eroherscans.xyz/manga/absolute-sword-sense/',
        id: '/manga/absolute-sword-sense/',
        title: 'Absolute Sword Sense'
    },
    child: {
        id: '/absolute-sword-sense-chapter-92/',
        title: 'Chapter 92'
    },
    entry: {
        index: 1,
        size: 994_822,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());