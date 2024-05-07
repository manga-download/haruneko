import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'penlab',
        title: 'Penlab'
    },
    container: {
        url: 'https://www.penlab.ink/titles/spirit-sprints/',
        id: '7611',
        title: 'Spirit Sprints',
        timeout: 10000
    },
    child: {
        id: '25742',
        title: 'Vol. 1, Chapter 1: Bugtong Bugtong Part 1'
    },
    entry: {
        index: 0,
        size: 850_842,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());