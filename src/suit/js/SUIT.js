/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */
import {firefly} from 'firefly/Firefly.js';
import {timeSeriesButton} from './actions.jsx';
import {mergeObjectOnly, getRootURL} from 'firefly/util/WebUtil.js';
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
        {label: 'RSP TAP Search', action: 'TAPSearch'},
        {label: 'External Images', action: 'ImageSelectDropDownCmd'},
        {label: 'External Catalogs', action: 'MultiTableSearchCmd'},
        {label: 'Add Chart', action: 'ChartSelectDropDownCmd'},
        {label: 'Upload', action: 'FileUploadDropDownCmd'}
    ],
};

const tapEntry= (label,url) => ({ label, value: url});
const lsstEntry= (url) => tapEntry('RSP',url);

let tapServices= [
    tapEntry('IRSA', 'https://irsa.ipac.caltech.edu/TAP'),
    tapEntry('Gaia', 'https://gea.esac.esa.int/tap-server/tap'),
    tapEntry('CADC', 'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap'),
    tapEntry('MAST Images', 'https://vao.stsci.edu/CAOMTAP/TapService.aspx'),
    tapEntry('GAVO', 'http://dc.g-vo.org/tap'),
    tapEntry('HSA',  'https://archives.esac.esa.int/hsa/whsa-tap-server/tap'),
    tapEntry('NED', 'https://ned.ipac.caltech.edu/tap/'),
    tapEntry('NASA Exoplanet Archive', 'https://exoplanetarchive.ipac.caltech.edu/TAP/'),
];



const TAP_PATH= 'api/tap';

/**
 * @param {String} url
 * @return {{tapUrl:String, confident:Boolean}} the tapUrl is the computed url, where "confident" is true if the url 
 * was computed by successfully finding the pathname component consistent with the RSP URL conventions -- under
 * which Firefly might be invoked either as the Portal Aspect application (i.e., under /portal), or as a JupyterLab
 * extension within the Notebook Aspect (i.e., under /nb) -- and substituting the pathname as appropriate to find
 * the TAP service (under /api).  Otherwise "confident" will be set to false and a guess at a possible local TAP
 * service URL will be made.
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
    tapServices=  confident ? [ lsstEntry(tapUrl), ...tapServices ] : [ ...tapServices, tapEntry('(possible local service)',tapUrl) ];
}

if (!tapUrl || !confident) {
    setTimeout( () =>
            showInfoPopup(
                `Could not infer the location of the TAP service for this RSP instance from the window URL: ${window.location.href}`, 5000));
}

let options = {
    multiTableSearchCmdOptions: [
        {id: 'irsacat', title: 'IRSA Catalogs'},
        {id: 'vocat'},
        {id: 'nedcat'}
    ],
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


props = mergeObjectOnly(props, window.firefly?.app ?? {});
options = mergeObjectOnly(options, window.firefly?.options ?? {});
firefly.bootstrap(props, options);
