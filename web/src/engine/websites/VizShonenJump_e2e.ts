import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const configShonenJump = {
    plugin: {
        id: 'vizshonenjump',
        title: 'Viz - Shonen Jump'
    },
    container: {
        url: 'https://www.viz.com/shonenjump/chapters/one-punch-man',
        id: '/shonenjump/chapters/one-punch-man',
        title: 'One-Punch Man'
    },
    child: {
        id: '/shonenjump/one-punch-man-chapter-1/chapter/4168?action=read',
        title: 'Ch. 1'
    },
    entry: {
        index: 4,
        size: 942_107,
        type: 'image/png'
    }
};

const fixtureShonenJump = new TestFixture(configShonenJump);
describe(fixtureShonenJump.Name, async () => (await fixtureShonenJump.Connect()).AssertWebsite());

const configViz = {
    plugin: {
        id: 'vizshonenjump',
        title: 'Viz - Shonen Jump'
    },
    container: {
        url: 'https://www.viz.com/vizmanga/chapters/the-kings-beast',
        id: '/vizmanga/chapters/the-kings-beast',
        title: 'The King’s Beast'
    },
    child: {
        id: '/vizmanga/the-kings-beast-chapter-1/chapter/35920?action=read',
        title: 'Ch. 1'
    },
    entry: {
        index: 1,
        size: 730_205,
        type: 'image/png'
    }
};

const fixtureViz = new TestFixture(configViz);
describe(fixtureViz.Name, async () => (await fixtureViz.Connect()).AssertWebsite());