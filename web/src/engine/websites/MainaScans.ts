import icon from './MainaScans.webp';
import LetonaScans from './LetonaScans';

export default class extends LetonaScans {

    public constructor() {
        super('mainascans', 'Maina Scans', 'https://mainascans.com');
    }

    public override get Icon() {
        return icon;
    }
}