/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */
import {firefly} from 'firefly/Firefly.js';
import {
    makeDefImageSearchActions,
    makeDefTableSearchActions, makeDefTapSearchActions, makeExternalSearchActions
} from 'firefly/ui/DefaultSearchActions.js';
import {mergeObjectOnly, getRootURL} from 'firefly/util/WebUtil.js';
import {getTAPServices} from 'firefly/ui/tap/TapKnownServices.js';
import {getFireflyViewerWebApiCommands} from 'firefly/api/webApiCommands/ViewerWebApiCommands.js';
import './suit.css';
import {makeLsstClickToAction, makeLsstTapEntry} from './actions.jsx';

// import SUIT_ICO from 'html/images/rubin_logo_transparent-70.png';

/**
 * This entry point is customized for LSST suit.  Refer to FFEntryPoint.js for information on
 * what could be used in defaults.
 */
let props = {
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
};

const LSST_TAP_LABEL= 'LSST RSP';

props = mergeObjectOnly(props, window.firefly?.app ?? {});



const tapServices=  [
    makeLsstTapEntry(),
    ...getTAPServices( ['IRSA', 'Gaia', 'CADC', 'MAST Images', 'GAVO', 'HSA', 'NED', 'NASA Exoplanet Archive'])
];


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
        // Use a server that is purely internal to the RSP, pending authentication-flow changes:
        hipsSourceURL : 'https://data-int.lsst.cloud/api/hips/images/color_gri',
        hipsSource360URL : 'http://hips.hips.svc.cluster.local:8080/api/hips/images/color_gri', // url
        fovDegFallOver: .00001, // small number will never show an image only a HiPS
        exclusiveHiPS: true,
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
    tapObsCore: {
        enableObsCoreDownload: true, // enable for other obscore
        [LSST_TAP_LABEL]  : {
            enableObsCoreDownload: false, //disable for the portal
            filterDefinitions: [
                {
                    name: 'LSSTCam',
                    options: [
                        {label: 'u', value : '367', title: '367nm central value'},
                        {label: 'g', value : '483', title: '483nm central value'},
                        {label: 'r', value : '622', title: '622nm central value'},
                        {label: 'i', value : '755', title: '755nm central value'},
                        {label: 'z', value : '869', title: '869nm central value'},
                        {label: 'y', value : '971', title: '971nm central value'},
                    ],
                },
            ],
            obsCoreCalibrationLevel: {
                tooltip: 'Calibration Level',
                helptext: '1 is raw data; 2 is PVIs; 3 includes coadds and difference images',
                level: {
                    1: {title: 'For Rubin: Raw Data'},
                    2: {title: 'For Rubin: PVIs'},
                    3: {title: 'For Rubin: Coadds and Difference Images'},
                },
            },
            obsCoreInstrumentName: {
                tooltip: 'LSSTCam, LSSTCam-imSim',
                placeholder: 'e.g. LSSTCam-imSim',
            },
            obsCoreSubType: {
                tooltip: 'Specific type of image or other dataset',
                placeholder: 'e.g. lsst.deepCoadd_calexp',
                helptext: '"lsst." + Butler Repo Dataset type',
            },
        }
    },
    hips: {
        readoutShowsPixel : true,
        hipsSources: 'lsst,cds',
        defHipsSources: {source: 'lsst', label: 'Rubin Featured'},
        mergedListPriority: 'lsst',
        adhocMocSource: {
            sources: [
                'temp://lsst/dp02_dc2/hips/images/color_gri',
                'temp://lsst/dp02_dc2/hips/images/band_u',
                'temp://lsst/dp02_dc2/hips/images/band_g',
            ],
            label: 'Rubin Featured MOC '
        },
    },
    // workspace: {showOptions: true},
    /* eslint-disable quotes */
    targetPanelExampleRow1: [`'62, -37'`, `'60.4 -35.1'`, `'4h11m59s -32d51m59s equ j2000'`, `'239.2 -47.6 gal'`],
    targetPanelExampleRow2: [`'NGC 1532' (NB: DC2 is a simulated sky, so names are not useful)`],
    /* eslint-enable quotes */
    searchActions : [
        ...makeExternalSearchActions(),
        ...makeDefTableSearchActions(),
        ...makeDefTapSearchActions(),
        ...makeDefImageSearchActions(),
        ...makeLsstClickToAction(),
    ],
    searchActionsCmdMask: [
        'tableTapUpload',
        'nedRadius', 'simbadRadius', 'gotoSimbadRadius',
        'tableNed', 'tableSimbad', 'tableSimbadGoto', 'imageFits', 'tableHiPS',
        'tapRadius', 'tapArea', 'tableTapRadius',
        'imageFits', 'HiPS', 'lsstObsCoreTap', 'lsstTruthSummaryRadius', 'lsstTruthSummaryArea',
        'lsstObsCoreTapTable', 'lsstTruthSummaryRadiusTable'
    ],
};

options = mergeObjectOnly(options, window.firefly?.options ?? {});
firefly.bootstrap(props, options,getFireflyViewerWebApiCommands());
