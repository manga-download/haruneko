import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nextscan',
        title: 'NextScan'
    },
    container: {
        url: 'https://www.nextscanid.my.id/2022/08/heavenly-demon-cultivation-simulation.html',
        id: '/2022/08/heavenly-demon-cultivation-simulation.html',
        title: 'Heavenly Demon Cultivation Simulation'
    },
    child: {
        id: '/2022/08/heavenly-demon-cultivation-simulation_22.html',
        title: 'Chapter 01'
    },
    entry: {
        index: 2,
        size: 1_881_721,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());