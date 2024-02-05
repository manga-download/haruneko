import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'arcrelight',
        title: 'Arc-Relight'
    },
    container: {
        url: 'https://arc-relight.com/reader/arc-light/',
        id: '/reader/arc-light/',
        title: 'Steins;Gate - Arc Light of the Point at Infinity'
    },
    child: {
        id: '/reader/arc-light/1/0/',
        title: 'Ch. 0: Prologue'
    },
    entry: {
        index: 0,
        size: 1_896_912,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());