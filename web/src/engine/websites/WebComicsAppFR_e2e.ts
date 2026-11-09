import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webcomicsapp-fr',
        title: 'WebComicsApp (French)',
    },
    container: {
        url: 'https://www.webcomicsapp.com/fr/action/je-ramasse-des-attributs-en-fin-du-monde/67c1216962661d3f187d74c9',
        id: '67c1216962661d3f187d74c9',
        title: 'Je ramasse des attributs en fin du monde'
    },
    child: {
        id: 'f1e3783d74b33ec32c45f5c2/1',
        title: 'Chap. 1'
    },
    entry: {
        index: 0,
        size: 66_018,
        type: 'image/png'
    }
}).AssertWebsite();