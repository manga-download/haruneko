import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'remangas',
        title: 'Remangas'
    },
    container: {
        url: 'https://remangas.net/manga/co56mo-n7ao-in8vocar-um-rei-d55emonio/',
        id: JSON.stringify({ post: '1922', slug: '/manga/co56mo-n7ao-in8vocar-um-rei-d55emonio/' }),
        title: 'Como NÃO Invocar um Rei Demônio'
    },
    child: {
        id: '/manga/co56mo-n7ao-in8vocar-um-rei-d55emonio/capitulo-106/',
        title: 'Capitulo 106'
    },
    entry: {
        index: 1,
        size: 434_785,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());