/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */
import {firefly} from 'firefly/Firefly.js';
import {mergeObjectOnly, getRootURL} from 'firefly/util/WebUtil.js';
import {showInfoPopup} from 'firefly/ui/PopupUtil.jsx';
import {makeWorldPt} from 'firefly/visualize/Point.js';
import {getTAPServices} from 'firefly/ui/tap/TapKnownServices.js';
import {getFireflyViewerWebApiCommands} from 'firefly/api/webApiCommands/ViewerWebApiCommands.js';
import {getDefaultMOCList} from 'firefly/visualize/HiPSMocUtil.js';
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
    ]
};

props = mergeObjectOnly(props, window.firefly?.app ?? {});
const {template}= props;

const lsstEntry= (label, url) => (
    {
        label,
        value: url,
        fovDeg: 10,
        centerWP: makeWorldPt(62,-37).toString(),
        hipsUrl: 'https://irsa.ipac.caltech.edu/data/hips/list',
        examples: [
            {
                description: 'Query the object table to get positions and composite model magnitudes and their errors in three filters using a CONE search to define a region on the sky. Filter on deblended sources with i-band magnitudes brighter than 25 mag.',
                statement:
`SELECT objectId, coord_ra, coord_dec, detect_isPrimary, 
scisql_nanojanskyToAbMag(g_cModelFlux) as gmag, scisql_nanojanskyToAbMag(i_cModelFlux) as imag,
scisql_nanojanskyToAbMag(r_cModelFlux) as rmag,
scisql_nanojanskyToAbMagSigma(g_cModelFlux, g_cModelFluxErr) as gmag_err,
scisql_nanojanskyToAbMagSigma(i_cModelFlux, i_cModelFluxErr) as imag_err,
scisql_nanojanskyToAbMagSigma(r_cModelFlux, r_cModelFluxErr) as rmag_err
FROM dp02_dc2_catalogs.Object
WHERE CONTAINS (POINT('ICRS', coord_ra, coord_dec), CIRCLE('ICRS', 62.0, -37.0, 0.05)) = 1
AND detect_isPrimary = 1`
            },
            {
                description: 'Jointly query the DiaSource and CcdVisit tables to obtain the magnitudes of all of the i-band detections in difference images (DiaSources) for a time-domain event within 2 arcsec of (67.4579, -44.0802), and the associated seeing and visitId.',
                statement:
`SELECT diasrc.ra, diasrc.decl, diasrc.diaObjectId, diasrc.diaSourceId, diasrc.filterName, diasrc.midPointTai,
scisql_nanojanskyToAbMag(diasrc.psFlux) AS psAbMag,
ccdvis.seeing, ccdvis.visitId
FROM dp02_dc2_catalogs.DiaSource AS diasrc JOIN dp02_dc2_catalogs.CcdVisit AS ccdvis
ON diasrc.ccdVisitId = ccdvis.ccdVisitId
WHERE CONTAINS(POINT('ICRS', diasrc.ra, diasrc.decl), CIRCLE('ICRS', 67.4579, -44.0802, 0.0006))=1
AND diasrc.filterName = 'i'`
            },
            {
                description: 'Query for processed visit images (calexps) that overlap the coordinate (62, -37) and were obtained in the r-band filter between modified Julian dates 60900 and 61000.',
                statement:
`SELECT dataproduct_type, dataproduct_subtype, calib_level, lsst_band, em_min, em_max, 
lsst_tract, lsst_patch, lsst_visit, lsst_filter, lsst_detector, t_exptime, t_min, t_max, s_ra, s_dec, s_fov, 
obs_id, obs_collection, o_ucd, facility_name, instrument_name, s_region, access_url, access_format 
FROM ivoa.ObsCore 
WHERE CONTAINS(POINT('ICRS', 62, -37), s_region)=1 
AND calib_level = 2 
AND dataproduct_type = 'image' 
AND ( t_min <= 61000 AND 60900 <= t_max ) 
AND ( 600e-9 BETWEEN em_min AND em_max )`
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
    coverage : { // example of using DSS and wise combination for coverage (not that anyone would want to combination)
        // hipsSourceURL : 'http://alasky.u-strasbg.fr/DSS/DSSColor',
        // hipsSourceURL : 'ivo://CDS/P/2MASS/color',
        // Use a server that is purely internal to the RSP, pending authentication-flow changes:
        hipsSourceURL : 'http://hips.hips.svc.cluster.local:8080/api/hips/images/color_gri',
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
        hipsSources: 'lsst,cds',
        defHipsSources: {source: 'lsst', label: 'Rubin Featured'},
        adhocMocSource: {
            sources: getDefaultMOCList(),
            label: 'Featured MOC '
        },
        mergedListPriority: 'lsst'
    },
    workspace: {showOptions: true},
    /* eslint-disable quotes */
    targetPanelExampleRow1: [`'62, -37'`, `'60.4 -35.1'`, `'4h11m59s -32d51m59s equ j2000'`, `'239.2 -47.6 gal'`],
    targetPanelExampleRow2: [`'NGC 1532' (NB: DC2 is a simulated sky, so names are not useful)`],
    /* eslint-enable quotes */
};

options = mergeObjectOnly(options, window.firefly?.options ?? {});
firefly.bootstrap(props, options,getFireflyViewerWebApiCommands());
