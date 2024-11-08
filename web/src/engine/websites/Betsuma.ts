const pageScript = `
    new Promise(async (resolve, reject) => {
        try {

            const staticServer = new NFBR.StaticServer();//StaticServer
            const params = new URL(window.location).searchParams;
            const parameters = await staticServer.a5W({
                contentId: params.get(NFBR.a5q.Key.CONTENT_ID), // Content ID => 'cid'
                a6m: params.get(NFBR.a5q.Key.LICENSE_TOKEN), // License Token => 'lit'
                preview: params.get(NFBR.a5q.Key.LOOK_INSIDE) === '1', // Look Inside => 'lin'
                contentType: params.get(NFBR.a5q.Key.CONTENT_TYPE) || 1, // Content Type => 'cty'
                title: params.get(NFBR.a5q.Key.CONTENT_TITLE), // Content Title => 'cti'
                winWidth: 3840,
                winHeight: 2160
            });

            const model = new NFBR.a6G.Model({
                'settings': new NFBR.Settings('NFBR.SettingData'),
                'viewerFontSize': NFBR.a0X.a3K,//'normal'
                'viewerFontFace': NFBR.a0X.a3k, //'default'
                'viewerSpreadDouble': false,
                'viewerb5c': null,
                'viewerSpread': {},
                'queryParamForContentUrl' : parameters.contentAppendParam,
            });

            const v_a6L = new NFBR.a6G.a6L(model); //a6G.a6L seems to be named identical between publus versions
            const content = new NFBR.a6i.Content(parameters.url);
            await v_a6L.bookLoader_.a5s(content, 'configuration', { query : model.get('queryParamForContentUrl')});

            const book = new NFBR.a6i.Book(parameters.url, [NFBR.a0X.a3K] , [NFBR.a0X.a3k]);
            book.setContent(NFBR.a0X.a3K, NFBR.a0X.a3k, content);
            book.setFileExt('.jpeg');
            const spreader = new NFBR.a6i.a6D(book);
            v_a6L.constructPages_(spreader);

            const pages = [ ];
            spreader.spreads.forEach( spread => {

                for ( const side of ['left', 'right'] ) {
                    const pageInfo = spread[side];
                    if (!pageInfo?.url) continue;
                    const blocks = NFBR.a3E.a3f(pageInfo.width, pageInfo.height, NFBR.a0X.a3g, NFBR.a0X.a3G, pageInfo.pattern);
                    pages.push({
                        mode: 'puzzle',
                        index: pageInfo.index,
                        imageUrl: new URL(parameters.url + pageInfo.url, window.location).href,
                        encryption: {
                            blocks: blocks,
                        }
                    });
                }

                resolve(pages.sort((a, b) => {
                    return a.index - b.index;
                }));

            });
        } catch (error) {
            reject(error);
        }
    });

`;