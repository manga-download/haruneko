﻿import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicborder',
        title: 'コミックボーダー (ComicBorder)'
    },
    container: {
        url: 'https://comicborder.com/episode/14079602755169791873',
        id: '/episode/14079602755169791873',
        title: '終末の魔女と人形'
    },
    child: {
        id: '/episode/14079602755169791873',
        title: 'Ep.01　貧民窟の魔女'
    },
    entry: {
        index: 0,
        size: 1_323_904,
        type: 'image/png'
    }
}).AssertWebsite();