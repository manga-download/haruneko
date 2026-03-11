import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'luscious',
        title: 'Luscious'
    },
    container: {
        url: 'https://www.luscious.net/albums/otsuka-kotora-angraecum-tankoubon-version-english_176038/',
        id: '176038',
        title: '[Otsuka Kotora] Angraecum (Tankoubon Version) [English]'
    },
    child: {
        id: '176038',
        title: '[Otsuka Kotora] Angraecum (Tankoubon Version) [English]'
    },
    entry: { //make sure we gather all pages
        index: 51,
        size: 441_229,
        type: 'image/png'
    }
}).AssertWebsite();