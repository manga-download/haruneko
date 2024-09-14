﻿import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mechacomic',
        title: 'MechaComic'
    },
    container: {
        url: 'https://mechacomic.jp/books/141740',
        id: '/books/141740',
        title: '青島くんはいじわる【フルカラー版】'
    },
    child: {
        id: '/free_chapters/1706074/download/bef74217cd24f55a00320c6cb544efb8d6af016e',
        title: '001話 豚足と王子様',
    },
    entry: {
        index: 0,
        size: 49_290,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());