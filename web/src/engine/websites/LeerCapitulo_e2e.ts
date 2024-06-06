import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const fixture = new TestFixture({
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
    /*
    entry: {
        index: 1,
        size: 573_549, // value switch between 317_943 and 573_549
        type: 'image/jpeg'
    }*/
});
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
