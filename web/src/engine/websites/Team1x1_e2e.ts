﻿import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'team1x1',
        title: 'Team X'
    },
    container: {
        url: 'https://olympustaff.com/series/villain-is-here',
        id: '/series/villain-is-here',
        title: 'Villain Is Here'
    },
    child: {
        id: '/series/villain-is-here/1',
        title: 'الفصل 1'
    },
    entry: {
        index: 0,
        size: 989_982,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();