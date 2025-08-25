import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webnovel',
        title: 'Webnovel Comics'
    },
    container: {
        url: 'https://www.webnovel.com/comic/tales-of-demons-and-gods_14622895506049901',
        id: '14622895506049901',
        title: 'Tales of Demons and Gods'
    },
    child: {
        id: '40207390380972711',
        title: '001 A Second Chance'
    },
    entry: {
        index: 0,
        size: 408_693,
        type: 'image/jpeg'
    }
}).AssertWebsite();