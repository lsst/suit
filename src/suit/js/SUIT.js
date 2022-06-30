/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */
import {firefly} from 'firefly/Firefly.js';
import {timeSeriesButton} from './actions.jsx';
import {mergeObjectOnly, getRootURL} from 'firefly/util/WebUtil.js';
import {showInfoPopup} from 'firefly/ui/PopupUtil.jsx';
import {getTAPServices} from 'firefly/ui/tap/TapKnownServices.js';
import {getFireflyViewerWebApiCommands} from 'firefly/api/webApiCommands/ViewerWebApiCommands.js';
import './suit.css';

// import SUIT_ICO from 'html/images/rubin_logo_transparent-70.png';

/**
 * This entry point is customized for LSST suit.  Refer to FFEntryPoint.js for information on
 * what could be used in defaults.
 */
var props = {
    showUserInfo: true,
    // appIcon: getRootURL() +'images/rubin_logo_transparent-40.png',
    appIcon: getRootURL() +'images/rubin-favicon-transparent-45px.png',
    bannerLeftStyle:{margin: '-2px 5px 0 10px'},
    showViewsSwitch: true,
    // rightButtons: [timeSeriesButton],
    menu: [
        {label: 'RSP TAP Search', action: 'TAPSearch'},
        {label: 'External Images', action: 'ImageSelectDropDownCmd'},
        {label: 'External Catalogs', action: 'MultiTableSearchCmd'},
        {label: 'Add Chart', action: 'ChartSelectDropDownCmd'},
        {label: 'Upload', action: 'FileUploadDropDownCmd'}
    ],
    coverage : { // example of using DSS and wise combination for coverage (not that anyone would want to combination)
        // hipsSourceURL : 'http://alasky.u-strasbg.fr/DSS/DSSColor',
        hipsSourceURL : 'ivo://CDS/P/2MASS/color',
        fovDegFallOver: .00001, // small number will never show an image only a HiPS
        // imageSourceParams: { //use wise if the user forces an image request
        //     Service : 'WISE',
        //     SurveyKey: '1b',
        //     SurveyKeyBand: '4'
        // },
        imageSourceParams: { //use 2mass if the user forces an image request
            Service : 'TWOMASS',
            SurveyKey: 'asky',
            SurveyKeyBand: 'k',
            title : '2MASS K_s'
        },
    }
};

props = mergeObjectOnly(props, window.firefly?.app ?? {});
const {template}= props;

const lsstEntry= (label, url) => (
    {
        label,
        value: url,
        examples: [
            {
                description: 'Query the object table to get positions and composite model magnitudes and their errors in three filters using a CONE search to define a region on the sky.  Filter on good sources  only',
                statement:
`SELECT objectId, ra, dec, good, mag_g_cModel as gmag, mag_i_cModel as imag, mag_r_cModel as rmag,
magerr_g_cModel as gmag_err, magerr_i_cModel as imag_err, magerr_r_cModel as rmag_err
FROM dp01_dc2_catalogs.object
WHERE CONTAINS (POINT('ICRS', ra, dec), CIRCLE('ICRS', 62.0, -37.0, 0.1 )) = 1 AND good = 1`
            },
            {
                description: 'Select all SNe from the truth match table at redshift < 1',
                statement:
`SELECT * FROM dp01_dc2_catalogs.truth_match
WHERE dp01_dc2_catalogs.truth_match.truth_type = 3
AND dp01_dc2_catalogs.truth_match.redshift < 1`
            },
            {
                description: 'Execute a cone search centered on (RA, Dec) = (61.863, -35.79) with a radius of 20 arcseconds and applying a cut on magnitude. Join with the truth catalog  and add in some quality filters on the match. Apply quality cuts on the match to return only those objects with a match in the truth catalog. Filter also on  sources satisfying the “is_good_match” flag',
                statement:
`SELECT obj.objectId, obj.ra, obj.dec, obj.mag_r_cModel, obj.cModelFlux_r, truth.mag_r, truth.flux_r, truth.truth_type
FROM dp01_dc2_catalogs.object as obj JOIN dp01_dc2_catalogs.truth_match as truth ON truth.match_objectId = obj.objectId
WHERE CONTAINS(POINT('ICRS', obj.ra, obj.dec),CIRCLE('ICRS', 62.0, -37.0, 0.1 )) = 1
AND truth.match_objectid >= 0 
AND truth.is_good_match = 1`,
            },
        ]
    });

let tapServices= getTAPServices( ['IRSA', 'Gaia', 'CADC', 'MAST Images',
    'GAVO', 'HSA', 'NED', 'NASA Exoplanet Archive']);


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
    tapServices=  confident ? [ lsstEntry('LSST RSP', tapUrl), ...tapServices ] : [ ...tapServices, lsstEntry('(possible local service)',tapUrl)];
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
    MenuItemKeys: {maskOverlay: true, imageSelect:false},
    RequireWebSocketUptime : true,
    imageTabs: ['fileUpload', 'url', '2mass', 'wise', 'sdss', 'msx', 'dss', 'iras'],
    irsaCatalogFilter: 'lsstFilter',
    catalogSpatialOp: 'polygonWhenPlotExist',
    image : {
        canCreateExtractionTable: true,
    },
    charts : {
        maxRowsForScatter: 20000,
    },
    tap : {
        services: tapServices,
        defaultMaxrec: 50000
    },
    hips: {
        readoutShowsPixel : true,
    },
    workspace: {showOptions: true},
    /* eslint-disable quotes */
    targetPanelExampleRow1: [`'62, -37'`, `'60.4 -35.1'`, `'4h11m59s -32d51m59s equ j2000'`, `'239.2 -47.6 gal'`],
    targetPanelExampleRow2: [`'NGC 1532' (NB: DC2 is a simulated sky, so names are not useful)`],
    /* eslint-enable quotes */
};

options = mergeObjectOnly(options, window.firefly?.options ?? {});
firefly.bootstrap(props, options,getFireflyViewerWebApiCommands());
