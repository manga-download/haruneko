import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'myhentaigallery',
        title: 'MyHentaiGallery'
    },
    container: {
        url: 'https://myhentaigallery.com/g/39592',
        id: '/g/39592',
        title: 'Trying Anal With Nino'
    },
    child: {
        id: '/g/39592',
        title: 'Trying Anal With Nino'
    },
    entry: {
        index: 0,
        size: 247_601,
        type: 'image/jpeg'
    }
}).AssertWebsite();