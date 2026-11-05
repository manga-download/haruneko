import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'pornhwapro',
        title: 'Pornhwa (.pro)',
    },
    container: {
        url: 'https://pornhwa.pro/manhwa/my-girlfriend-was-already-fully-trained/',
        id: '/manhwa/my-girlfriend-was-already-fully-trained/',
        title: 'My Girlfriend Was Already Fully Trained'
    },
    child: {
        id: '/manhwa/my-girlfriend-was-already-fully-trained/chapter-44/',
        title: 'Chapter 44'
    },
    entry: {
        index: 0,
        size: 347_354,
        type: 'image/webp'
    }
}).AssertWebsite();