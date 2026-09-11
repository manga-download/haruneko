import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatoon-fr',
        title: 'MangaToon (French)',
    },
    container: {
        url: 'https://fr.mangatoon.mobi/1114888-faire-entrer-le-loup',
        id: '1114888',
        title: 'faire entrer le loup'
    },
    child: {
        id: '25874',
        title: 'Épisode 1'
    },
    entry: {
        index: 3,
        size: 4_912,
        type: 'image/webp'
    }
}).AssertWebsite();