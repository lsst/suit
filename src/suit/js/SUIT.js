/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */


import {get} from 'lodash';

import {firefly} from 'firefly/Firefly.js';
import {timeSeriesButton} from './actions.jsx';
import {mergeObjectOnly} from 'firefly/util/WebUtil.js';
import {showInfoPopup} from 'firefly/ui/PopupUtil.jsx';
import './suit.css';


/**
 * This entry point is customized for LSST suit.  Refer to FFEntryPoint.js for information on
 * what could be used in defaults.
 */
var props = {
    showUserInfo: true,
    appIcon: 'images/lsst_logo.png',
    showViewsSwitch: true,
    rightButtons: [timeSeriesButton],
    menu: [
        {label: 'LSST TAP', action: 'TAPSearch'},
        {label: 'Legacy PDAC', action: 'LsstCatalogDropDown'},
        {label: 'External Images', action: 'ImageSelectDropDownCmd'},
        {label: 'External Catalogs', action: 'IrsaCatalogDropDown'},
        {label: 'Add Chart', action: 'ChartSelectDropDownCmd'},
        {label: 'Upload', action: 'FileUploadDropDownCmd'}
    ],
};

function findCorrectTapService() {
    const url= window.location.href;
    const idx= url.indexOf('/portal');
    if (idx===-1) return;
    return `${url.substr(0,idx)}/api/tap`;
}

var options = {
    MenuItemKeys: {maskOverlay: true},
    imageTabs: ['fileUpload', 'url', '2mass', 'wise', 'sdss', 'msx', 'dss', 'iras'],
    irsaCatalogFilter: 'lsstFilter',
    catalogSpacialOp: 'polygonWhenPlotExist',
    tap : {
        services: [
            { label: 'CADC https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap',
                value: 'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap' },
            { label: 'GAIA https://gea.esac.esa.int/tap-server/tap',
                value: 'https://gea.esac.esa.int/tap-server/tap' },
            { label: 'HSA https://archives.esac.esa.int/hsa/whsa-tap-server/tap',
                value: 'https://archives.esac.esa.int/hsa/whsa-tap-server/tap' },
            { label: 'GAVO http://dc.g-vo.org/tap',
                value: 'http://dc.g-vo.org/tap'},
            { label: 'IRSA https://irsa.ipac.caltech.edu/TAP',
                value: 'https://irsa.ipac.caltech.edu/TAP' },
            { label: 'MAST https://vao.stsci.edu/CAOMTAP/TapService.aspx',
                value: 'https://vao.stsci.edu/CAOMTAP/TapService.aspx' },
            { label: 'NED https://ned.ipac.caltech.edu/tap',
                value: 'https://ned.ipac.caltech.edu/tap/' },
        ],
        defaultMaxrec: 50000
    },
    workspace: {showOptions: true}
};

const lsstTapService= findCorrectTapService();
if (lsstTapService) {
    options.tap.services= [
        { label: `LSST LSP ${lsstTapService}`, value: lsstTapService },
        ...options.tap.services
    ];
}
else {
    setTimeout(
        () => showInfoPopup('Could not auto-detect the location of the TAP service for this LSP instance.'), 5000)
}

props = mergeObjectOnly(props, get(window, 'firefly.app', {}));
options = mergeObjectOnly(options, get(window, 'firefly.options', {}));
firefly.bootstrap(props, options);
