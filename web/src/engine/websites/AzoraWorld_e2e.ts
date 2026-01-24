import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'azoraworld',
        title: 'ازورا مانجا (AZORA MANGA / WORLD)'
    },
    container: {
        url: 'https://azoramoon.com/series/return-of-the-unrivaled-spear-knight',
        id: '838',
        title: 'Return of The Unrivaled Spear Knight'
    },
    child: {
        id: '/series/return-of-the-unrivaled-spear-knight/chapter-1',
        title: 'Chapter 1',
    },
    entry: {
        index: 0,
        size: 757_319,
        type: 'image/jpeg'
    }
}).AssertWebsite();