import { Tags } from '../Tags';
import icon from './SouDongMan.webp';
import MHKX, { type MhkxInfos } from './decorators/MHKX';
import * as Common from './decorators/Common';

@Common.ImageAjax(true)
export default class extends MHKX {
    public constructor() {
        const product: MhkxInfos = {
            id: '9',
            name: 'soudm',
            platform: 'pc'
        };

        super('soudongman', `斗罗大陆 (SouDongMan)`, 'https://www.soudongman.com', product, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}