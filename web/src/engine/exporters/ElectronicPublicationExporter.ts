import JSZip from 'jszip';
import { MangaExporter } from './MangaExporter';
import { SanitizeFileName } from '../StorageController';

export class ElectronicPublicationExporter extends MangaExporter {

    private readonly xmlParser = new DOMParser();
    private readonly xmlSerializer = new XMLSerializer();

    private CreateContainer() {
        const xml = this.xmlParser.parseFromString(`<?xml version="1.0" encoding="UTF-8"?>
            <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
                <rootfiles>
                    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
                </rootfiles>
            </container>
        `, 'text/xml');

        return this.xmlSerializer.serializeToString(xml);
    }

    /**
     * ...
     * @param title - HTML safe encoded title of the page
     * @param image - HTML safe encoded name of the image file
     */
    private CreatePage(page: number, imageFileName: string) {
        const xml = this.xmlParser.parseFromString(`<?xml version="1.0" encoding="UTF-8"?>
            <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <title>Page ${page}</title>
                    <style>
                        body {
                            text-align: center;
                        }
                        img {
                            object-fit: contain;
                            max-height: 100%;
                            max-width: 100%;
                        }
                    </style>
                </head>
                <body xmlns:epub="http://www.idpf.org/2007/ops">
                    <img alt="${imageFileName}" src="../assets/${imageFileName}"/>
                </body>
            </html>
        `, 'text/xml');

        return this.xmlSerializer.serializeToString(xml);
    }

    private CreatePackageFile(uid: string, title: string, language: string) {
        const uuidRefernce = Date.now().toString(36);
        const xml = this.xmlParser.parseFromString(`<?xml version="1.0" encoding="UTF-8"?>
            <package unique-identifier="${uuidRefernce}" version="3.0" xmlns="http://www.idpf.org/2007/opf" xmlns:opf="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/">
                <metadata>
                    <dc:title></dc:title>
                    <dc:language>${language}</dc:language>
                    <dc:identifier id="${uuidRefernce}">${uid}</dc:identifier>
                    <meta name="generator" content="HakuNeko"/>
                    <meta property="dcterms:modified">${new Date().toISOString().split('.').shift()}Z</meta>
                </metadata>
                <manifest>
                    <item id="NCX" href="toc.ncx" media-type="application/x-dtbncx+xml"></item>
                    <item id="TOC" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"></item>
                </manifest>
                <spine toc="NCX"></spine>
            </package>
        `, 'text/xml');

        xml.querySelector('metadata title').textContent = title;
        const manifest = xml.querySelector('manifest');
        const spine = xml.querySelector('spine');

        return {
            add: (page: number, pageFileName: string, imageFileName: string, imageFileType: string) => {
                spine.append(this.CreateItemRef.call(xml, 'XHTML_' + page));
                manifest.append(this.CreateItem.call(xml, 'IMG_' + page, 'assets/' + imageFileName, imageFileType));
                manifest.append(this.CreateItem.call(xml, 'XHTML_' + page, 'xhtml/' + pageFileName, 'application/xhtml+xml'));
            },
            serialize: () => this.xmlSerializer.serializeToString(xml),
        };
    }

    private CreateTableOfContent(title: string) {
        const xml = this.xmlParser.parseFromString(`<?xml version="1.0" encoding="UTF-8"?>
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
            <head>
                <title></title>
            </head>
            <body>
                <nav epub:type="toc">
                    <ol></ol>
                </nav>
            </body>
            </html>
        `, 'text/xml');

        xml.querySelector('head title').textContent = title;
        const navigation = xml.querySelector('nav ol');

        return {
            add: (page: number, pageFileName: string) => navigation.appendChild(this.CreateNavLink.call(xml, page, 'xhtml/' + pageFileName)),
            serialize: () => this.xmlSerializer.serializeToString(xml),
        };
    }

    private CreateNavLink(this: Document, page: number, source: string) {
        const navpoint = this.createElementNS(this.lookupNamespaceURI(null), 'li');
        const link = this.createElementNS(this.lookupNamespaceURI(null), 'a');
        link.setAttribute('href', source);
        link.textContent = 'Page ' + page;
        navpoint.appendChild(link);
        return navpoint;
    }

    private CreateNCX(uid: string, title: string) {
        const xml = this.xmlParser.parseFromString(`<?xml version="1.0" encoding="UTF-8"?>
            <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
                <head>
                    <meta name="dtb:uid" content="${uid}"/>
                </head>
                <docTitle>
                    <text></text>
                </docTitle>
                <navMap></navMap>
            </ncx>
        `, 'text/xml');

        xml.querySelector('docTitle text').textContent = title;
        const navigation = xml.querySelector('navMap');

        return {
            add: (page: number, pageFileName: string) => navigation.appendChild(this.CreateNavPoint.call(xml, 'NCX_' + page, page, 'xhtml/' + pageFileName)),
            serialize: () => this.xmlSerializer.serializeToString(xml),
        };
    }

    private CreateItem(this: Document, id: string, href: string, type: string) {
        const item = this.createElementNS(this.lookupNamespaceURI(null), 'item');
        item.setAttribute('id', id);
        item.setAttribute('href', href);
        item.setAttribute('media-type', type);
        return item;
    }

    private CreateItemRef(this: Document, idref: string) {
        const itemref = this.createElementNS(this.lookupNamespaceURI(null), 'itemref');
        itemref.setAttribute('idref', idref);
        return itemref;
    }

    private CreateNavPoint(this: Document, id: string, page: number, source: string) {
        const navpoint = this.createElementNS(this.lookupNamespaceURI(null), 'navPoint');
        navpoint.setAttribute('id', id);
        navpoint.setAttribute('playOrder', page.toString());
        //
        const label = this.createElementNS(this.lookupNamespaceURI(null), 'navLabel');
        const text = this.createElementNS(this.lookupNamespaceURI(null), 'text');
        text.textContent = `Page ${ page }`;
        navpoint.replaceChildren(label);
        const content = this.createElementNS(this.lookupNamespaceURI(null), 'content');
        content.setAttribute('src', source);

        label.appendChild(text);
        navpoint.appendChild(label);
        navpoint.appendChild(content);

        return navpoint;
        /*
        navpoint.innerHTML = `
            <navLabel>
                <text>Page ${page}</text>
            </navLabel>
            <content src="${source}"/>
        `;
        return navpoint;
        */
    }

    public async Export(sourceFileList: Map<number, string>, targetDirectory: FileSystemDirectoryHandle, targetBaseName: string): Promise<void> {

        const zip = new JSZip();
        // FIXME: Cannot be extracted on MacOS when name is missing an file extension
        zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
        zip.folder('META-INF').file('container.xml', this.CreateContainer(), { compression: 'DEFLATE' });

        const uid = crypto.randomUUID().toUpperCase();
        const digits = sourceFileList.size.toString().length;

        const oebps = zip.folder('OEBPS');
        const xhtml = oebps.folder('xhtml');
        const assets = oebps.folder('assets');
        const ncx = this.CreateNCX(uid, targetBaseName);
        const toc = this.CreateTableOfContent(targetBaseName);
        const opf = this.CreatePackageFile(uid, targetBaseName, 'UND');

        const promises = new Array(sourceFileList.size).fill(null).map(async (_, index) => {
            const page = index + 1;
            const pageFileName = page + '.xhtml';
            const { name: imageFileName, data } = await super.ReadTempImageData(sourceFileList.get(index), index, digits);

            assets.file(imageFileName, data, { compression: 'STORE' });
            xhtml.file(pageFileName, this.CreatePage(page, imageFileName), { compression: 'DEFLATE' });

            ncx.add(page, pageFileName);
            toc.add(page, pageFileName);
            opf.add(page, pageFileName, imageFileName, data.type);
        });

        await Promise.all(promises);

        oebps.file('toc.ncx', ncx.serialize(), { compression: 'DEFLATE' });
        oebps.file('toc.xhtml', toc.serialize(), { compression: 'DEFLATE' });
        oebps.file('content.opf', opf.serialize(), { compression: 'DEFLATE' });

        const file = await targetDirectory.getFileHandle(SanitizeFileName(targetBaseName + '.epub'), { create: true });
        const stream = await file.createWritable();
        await stream.write(await zip.generateAsync({ type: 'blob' }));
        await stream.close();
    }
}