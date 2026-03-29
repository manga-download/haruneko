new Promise(async (resolve, reject) => {
    try {

        const urlParams = new URL(window.location).searchParams;

        //Create a model
        const model = new NFBR.a6G.Model({
            'settings': new self.NFBR.Settings('NFBR.SettingData'),
            'viewerFontSize': self.NFBR.a0X.a3K,
            'viewerFontFace': self.NFBR.a0X.a3k,
            'viewerSpreadDouble': true,
            'viewerb5c': null,
            'viewerSpread': {},
        });

        const v_a6L = new NFBR.a6G.a6L(model); //a6G.a6L : class with 'POPUP_NAME_URL';
        const contentId = urlParams.get(NFBR.a5q.Key.CONTENT_ID);
        let contentType = parseInt(urlParams.get(NFBR.a5q.Key.CONTENT_TYPE)) ?? undefined;

        v_a6L.model.set('contentId', contentId);
        v_a6L.model.set('contentType', contentType);

        const a5wBody = {
            contentId: urlParams.get(NFBR.a5q.Key.CONTENT_ID), // Content ID => 'cid'
            a6m: urlParams.get(NFBR.a5q.Key.LICENSE_TOKEN), // License Token => 'lit'
            preview: urlParams.get(NFBR.a5q.Key.LOOK_INSIDE) === '1', // Look Inside => 'lin'
            contentType,
            title: true,
            winWidth: 3840,
            winHeight: 2160

            //contentType: urlParams.get(NFBR.a5q.Key.CONTENT_TYPE), // Content Type => 'cty'
            //title: urlParams.get(NFBR.a5q.Key.CONTENT_TITLE), // Content Title => 'cti'
            //winWidth: 3840,
            //winHeight: 2160
        };

        // Create Server
        const a2f = NFBR.StaticServer ? new NFBR.StaticServer() : new NFBR.a2F ? new NFBR.a2F() : new NFBR.a2f();//StaticServer
        const parameters = await a2f.a5W(a5wBody);

        //fix parameters
        v_a6L.model.set('contentType', parameters[NFBR.a5q.Key.CONTENT_TYPE]);
        v_a6L.model.set('queryParamForContentUrl', parameters.contentAppendParam)

        //Create a "Content" that will be filled using the bookloader as5 async function
        const label = [self.NFBR.a0X.a3K, self.NFBR.a0X.a3k].join('_');
        const content = parameters[NFBR.a5q.Key.CONTENT_TYPE] === 1 || parameters[NFBR.a5q.Key.CONTENT_TYPE] === 2 ? new NFBR.a6i.Content(parameters.url) : new NFBR.a6i.Content(parameters.url + label + "/");
        await v_a6L.bookLoader_.a5s(content, 'configuration', v_a6L);

        const pageUrlPrefix = parameters[NFBR.a5q.Key.CONTENT_TYPE] === 1 || parameters[NFBR.a5q.Key.CONTENT_TYPE] === 2 ? parameters.url : parameters.url + label + "/";

        debugger;


        //ABOVE PART SEEM GOOD FOR ALL WEBSITES, NOW WE MUST FIX PAGE AND BLOCK COMPUTING 

        const pages = content.configuration.contents.map((page, index) => {
            let mode = 'raw';
            let extension = '.jpeg';

            const pageInfos = content.files[index].FileLinkInfo.PageLinkInfoList[0].Page;
            const imageUrl = pageUrlPrefix + page.file + '/' + pageInfos.No + extension;

            //compute checksum
            const tmp = page.file + '/' + pageInfos.No.toString();
            for (d = v = 0; d < tmp.length; d++) v += tmp.charCodeAt(d);

            const pattern = v % NFBR.a0X.a3h + 1;
            let blocks = [];

            if (pageInfos.DummyWidth != null)
            {
                mode = 'puzzle';
                blocks = window.NFBR.a3E.a3f(pageInfos.Size.Width, pageInfos.Size.Height, NFBR.a0X.a3g, NFBR.a0X.a3G, pattern);
            }
            return {
                mode: mode,
                imageUrl,
                encryption: {
                    blocks: blocks,
                }
            };
        });
        resolve(pages);

    } catch (error) {
        reject(error);
    }
});