import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hoifansub',
        title: 'Hoi Fansub'
    },
    container: {
        url: 'https://hoifansub.com/manga/love-strongly-surprise/',
        id: JSON.stringify({ post: '609', slug: '/manga/love-strongly-surprise/' }),
        title: 'Love Strongly, Surprise!'
    },
    child: {
        id: '/manga/love-strongly-surprise/bolum-12/',
        title: 'Bölüm 12'
    }, /*
    entry: {    //Login needed
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());