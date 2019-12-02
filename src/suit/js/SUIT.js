/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */


import {get} from 'lodash';

import {firefly} from 'firefly/Firefly.js';
import {timeSeriesButton} from './actions.jsx';
import {mergeObjectOnly} from 'firefly/util/WebUtil.js';
import {getRootURL} from 'firefly/util/BrowserUtil.js';
import {showInfoPopup} from 'firefly/ui/PopupUtil.jsx';
import './suit.css';

// import SUIT_ICO from 'html/images/lsst_logo.png';

/**
 * This entry point is customized for LSST suit.  Refer to FFEntryPoint.js for information on
 * what could be used in defaults.
 */
var props = {
    showUserInfo: true,
    appIcon: getRootURL() +'images/lsst_logo.png',
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

const tapEntry= (label,url) => ({ label: `${label} ${url}`, value: url });
const lsstEntry= (url) => tapEntry('LSST LSP',url);

let tapServices= [
    tapEntry('CADC', 'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap'),
    tapEntry('GAIA', 'https://gea.esac.esa.int/tap-server/tap'),
    tapEntry('GAVO', 'http://dc.g-vo.org/tap'),
    tapEntry('HSA',  'https://archives.esac.esa.int/hsa/whsa-tap-server/tap'),
    tapEntry('IRSA', 'https://irsa.ipac.caltech.edu/TAP'),
    tapEntry('MAST', 'https://vao.stsci.edu/CAOMTAP/TapService.aspx'),
    tapEntry('NED', 'https://ned.ipac.caltech.edu/tap/'),
];



const TAP_PATH= 'api/tap';

/**
 * @param {String} url
 * @return {{tapUrl:String, confident:Boolean}} the tapUrl is the computed url, confident is true if the url was computed
 * by finding the protal stirng and replacing, otherwise a url might be returned bug confident will be false
 */
function findCorrectLSSTTapService(url) {
    try {
        const {origin,pathname}= new URL(url);
        let idx= pathname.indexOf('/portal');
        if (idx===-1) idx= pathname.indexOf('/nb');
        if (idx===-1) return {tapUrl:`${origin}/${TAP_PATH}`, confident:false};
        return {tapUrl:`${origin}${pathname.substr(0,idx)}/${TAP_PATH}`, confident:true};
    } catch (e) {
        return {tapUrl:undefined,confident:false};
    }
}

const {tapUrl,confident}= findCorrectLSSTTapService(window.location.href);
if (tapUrl) { // if a url is produced with confidence put it at the top otherwise put it at the bottom
    tapServices=  confident ? [ lsstEntry(tapUrl), ...tapServices ] : [ ...tapServices, lsstEntry(tapUrl) ];
}

if (!tapUrl || !confident) {
    setTimeout( () =>
            showInfoPopup(
                `Could not infer the location of the TAP service for this LSP instance from the window, URL: ${window.location.href}`, 5000));
}

var options = {
    MenuItemKeys: {maskOverlay: true},
    imageTabs: ['fileUpload', 'url', '2mass', 'wise', 'sdss', 'msx', 'dss', 'iras'],
    irsaCatalogFilter: 'lsstFilter',
    catalogSpacialOp: 'polygonWhenPlotExist',
    tap : {
        services: tapServices,
        defaultMaxrec: 50000
    },
    workspace: {showOptions: true}
};


props = mergeObjectOnly(props, get(window, 'firefly.app', {}));
options = mergeObjectOnly(options, get(window, 'firefly.options', {}));
firefly.bootstrap(props, options);
