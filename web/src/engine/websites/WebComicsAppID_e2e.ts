import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webcomicsapp-id',
        title: 'WebComicsApp (Indonesian)',
    },
    container: {
        url: 'https://www.webcomicsapp.com/id/sci-fi/pahlawan-terakhir-di-dunia-kiamat/6836b68862661d7335241b5a',
        id: '6836b68862661d7335241b5a',
        title: 'Pahlawan Terakhir di Dunia Kiamat'
    },
    child: {
        id: '43be660339b129d650087130/1',
        title: 'Bab. 1'
    },
    entry: {
        index: 0,
        size: 27_260,
        type: 'image/png'
    }
}).AssertWebsite();