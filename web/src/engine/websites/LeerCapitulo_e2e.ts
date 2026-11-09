import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'leercapitulo',
        title: 'LeerCapitulo'
    },
    container: {
        url: 'https://www.leercapitulo.co/manga/fdmz4f37aw/yuan-zun/',
        id: '/manga/fdmz4f37aw/yuan-zun/',
        title: 'Yuan Zun'
    },
    child: {
        id: '/leer/fdmz4f37aw/yuan-zun/1055/',
        title: 'Capitulo 1055'
    },
    entry: {
        index: 1,
        size: 259_675,
        type: 'image/jpeg'
    }
}).AssertWebsite();
