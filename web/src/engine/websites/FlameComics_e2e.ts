import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'flamecomics',
        title: 'Flame Comics',
        timeout: 30000
    },
    container: {
        url: 'https://flamecomics.me/series/solo-necromancy/',
        id: '/series/solo-necromancy/',
        title: 'Solo Necromancy'
    },
    child: {
        id: '/solo-necromancy-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 3_653_029,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());