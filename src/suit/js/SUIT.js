/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */
import {TapSearchPanel} from 'firefly/ui/tap/TapSearchRootPanel.jsx';
import {defaultTheme} from 'firefly/ui/ThemeSetup.js';
import React from 'react';
import {set} from 'lodash';

import {firefly} from 'firefly/Firefly.js';
import {
    makeDefImageSearchActions,
    makeDefTableSearchActions, makeDefTapSearchActions, makeExternalSearchActions
} from 'firefly/ui/DefaultSearchActions.js';
import {mergeObjectOnly, getRootURL} from 'firefly/util/WebUtil.js';
import {getTAPServices} from 'firefly/ui/tap/TapKnownServices.js';
import {getFireflyViewerWebApiCommands} from 'firefly/api/webApiCommands/ViewerWebApiCommands.js';
import './suit.css';
import {makeLsstClickToAction, makeLsstTapEntry, LSST_DP02_DC2, LSST_DP03_SSO} from './actions.jsx';
import {RubinLanding} from './RubinLanding.jsx';
import APP_ICON from '../html/images/rubin-favicon-transparent-45px.png';

// import SUIT_ICO from 'html/images/rubin_logo_transparent-70.png';

const OTHER_CAT= 'Other archive searches';

const RUBIN= 'Rubin searches';
const LSST_DP02_DC2_IMAGES= LSST_DP02_DC2+'-images';
// const LSST_DP03_SSO_IMAGES=LSST_DP03_SSO+'-images';

/**
 * This entry point is customized for LSST suit.  Refer to FFEntryPoint.js for information on
 * what could be used in defaults.
 */
let props = {
    showUserInfo: true,
    appIcon: <img src={APP_ICON}/>,
    showViewsSwitch: true,
    menu: [
        {label: 'DP0.2 Images', action: LSST_DP02_DC2_IMAGES, primary:true, category:RUBIN,
            title: 'Search DP0.2 Images'},
        {label: 'DP0.2 Catalogs', action: LSST_DP02_DC2, primary:true, category:RUBIN,
            title: 'Search DP0.2 catalogs'},
        {label: 'DP0.3 Catalogs', action: LSST_DP03_SSO, primary:true, category:RUBIN,
            title: 'Search DP0.3 catalogs'},

        {label:'General TAP', action: 'TAPSearch', category:OTHER_CAT},
        {label: 'IRSA Images', action: 'ImageSelectDropDownCmd', category: OTHER_CAT},
        {label: 'IRSA Catalogs', action: 'MultiTableSearchCmd', category: OTHER_CAT},
        {label:'NED Objects', action: 'ClassicNedSearchCmd', primary: false, category:OTHER_CAT},
        {label:'VO Cone Search', action: 'ClassicVOCatalogPanelCmd', primary: false, category: OTHER_CAT},

        {label: 'Upload', action: 'FileUploadDropDownCmd', primary:true}
    ],
    appTitle: 'Rubin Portal',
    landingPage: <RubinLanding/>,
    fileDropEventAction: 'FileUploadDropDownCmd',
    slotProps: set({}, 'banner.slotProps.icon.style', {margin: '3px 10px 0 10px'}),


    dropdownPanels: [
        <TapSearchPanel lockService={true} lockedServiceName={LSST_DP02_DC2} groupKey={LSST_DP02_DC2}
                        layout= {{width: '100%'}}
                        name={LSST_DP02_DC2}/>,
        <TapSearchPanel lockService={true} lockedServiceName={LSST_DP02_DC2_IMAGES} groupKey={LSST_DP02_DC2_IMAGES}
                        lockObsCore={true} obsCoreLockTitle='DP0.2 Image Search via ObsTAP'
                        layout= {{width: '100%'}}
                        name={LSST_DP02_DC2_IMAGES}/>,
        <TapSearchPanel lockService={true} lockedServiceName={LSST_DP03_SSO} groupKey={LSST_DP03_SSO}
                        layout= {{width: '100%'}}
                        name={LSST_DP03_SSO}/>,
        // <TapSearchPanel lockService={true} lockedServiceName={LSST_DP03_SSO_IMAGES} groupKey={LSST_DP03_SSO_IMAGES}
        //                 lockObsCore={true}
        //                 layout= {{width: '100%'}}
        //                 name={LSST_DP03_SSO_IMAGES}/>,
    ],



};

// const LSST_TAP_LABEL= 'LSST DP0.2 DC2';

props = mergeObjectOnly(props, window.firefly?.app ?? {});



const tapServices=  [
    makeLsstTapEntry(),
    ...getTAPServices( ['IRSA', 'Gaia', 'CADC', 'MAST Images', 'GAVO', 'HSA', 'NED', 'NASA Exoplanet Archive'])
];


let options = {
    theme: {
        customized: () => ({
                ...defaultTheme(),
                fontFamily: {
                    display: 'Source Sans Pro', // applies to `h1`–`h4`
                    body: 'Source Sans Pro', // applies to `title-*` and `body-*`
                },
                DISABLED_colorSchemes: {
                    light: {
                      palette: {
                        primary: {
                          50: '#f8fafc',
                          100: '#f1f5f9',
                          200: '#e2e8f0',
                          300: '#cbd5e1',
                          400: '#94a3b8',
                          500: '#64748b',
                          600: '#475569',
                          700: '#334155',
                          800: '#1e293b',
                          900: '#0f172a'
                        }
                      }
                    },
                    dark: {
                      palette: {
                        primary: {
                          50: '#fafafa',
                          100: '#f4f4f5',
                          200: '#e4e4e7',
                          300: '#d4d4d8',
                          400: '#a1a1aa',
                          500: '#71717a',
                          600: '#52525b',
                          700: '#3f3f46',
                          800: '#27272a',
                          900: '#18181b'
                        }
                      }
                    }
                  }
            }
        )
    },
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
        [LSST_DP02_DC2]  : {
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
