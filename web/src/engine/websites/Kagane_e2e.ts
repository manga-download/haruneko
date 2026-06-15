import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kagane',
        title: 'Kagane'
    },
    container: {
        url: 'https://kagane.to/series/019c2b1c-cc9b-745f-afed-09c230759162',
        id: '019c2b1c-cc9b-745f-afed-09c230759162',
        title: 'Dungeon Porter',
    },
    child: {
        id: '019c2bda-f619-716e-b0f5-043564eecffe',
        title: 'Ep. 40 - Mimic Market'
    },
    entry: {
        index: 22,
        size: 282_505,
        type: 'image/jpeg'
    }
}).AssertWebsite();