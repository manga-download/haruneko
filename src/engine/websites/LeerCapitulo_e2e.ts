import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'leercapitulo',
        title: 'LeerCapitulo'
    },
    container: {
        url: 'https://www.leercapitulo.co/manga/xvziyp/yuan-zun/',
        id: '/manga/xvziyp/yuan-zun/',
        title: 'Yuan Zun'
    },
    child: {
        id: '/leer/xvziyp/yuan-zun/1055/',
        title: 'Capitulo 1055'
    },
    entry: {
        index: 1,
        size: 602_693, // value switch between 317_943 and 602_693
        type: 'image/jpeg'
    }
}).AssertWebsite();
