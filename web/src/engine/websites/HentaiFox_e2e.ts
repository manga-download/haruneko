import { TestFixture } from '../../../test/WebsitesFixture';

// Old CDN
new TestFixture({
    plugin: {
        id: 'hentaifox',
        title: 'HentaiFox'
    },
    container: {
        url: 'https://hentaifox.com/gallery/3161/',
        id: '/gallery/3161/',
        title: 'RE 10'
    },
    child: {
        id: '/gallery/3161/',
        title: 'RE 10'
    },
    entry: {
        index: 0,
        size: 151_623,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// New CDN
new TestFixture({
    plugin: {
        id: 'hentaifox',
        title: 'HentaiFox'
    },
    container: {
        url: 'https://hentaifox.com/gallery/142053/',
        id: '/gallery/142053/',
        title: 'Corrupt Researcher'
    },
    child: {
        id: '/gallery/142053/',
        title: 'Corrupt Researcher'
    },
    entry: {
        index: 0,
        size: 116_598,
        type: 'image/webp'
    }
}).AssertWebsite();