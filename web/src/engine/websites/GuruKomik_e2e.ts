import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'gurukomik',
        title: 'Guru Komik'
    },
    container: {
        url: 'https://gurukomiklive.blogspot.com/2021/03/boku-no-kanojo-sensei.html',
        id: '/2021/03/boku-no-kanojo-sensei.html',
        title: 'Boku no Kanojo Sensei'
    },
    child: {
        id: '/2020/08/chapter-1.html',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 219_456,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());