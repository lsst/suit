/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */
import {getAppOptions} from 'firefly/api/ApiUtil';
import {DLGeneratedDropDown} from 'firefly/ui/dynamic/DLGeneratedDropDown';
import {SIAv2SearchPanel} from 'firefly/ui/tap/SIASearchRootPanel';
import {getSIAv2ServicesByName} from 'firefly/ui/tap/SiaUtil';
import React from 'react';
import {set} from 'lodash';
import {firefly} from 'firefly/Firefly.js';
import {TapSearchPanel} from 'firefly/ui/tap/TapSearchRootPanel.jsx';
import {defaultTheme} from 'firefly/ui/ThemeSetup.js';
import {
    makeDefImageSearchActions,
    makeDefTableSearchActions, makeDefTapSearchActions, makeExternalSearchActions
} from 'firefly/ui/DefaultSearchActions.js';
import {mergeObjectOnly} from 'firefly/util/WebUtil.js';
import {getTAPServicesByName} from 'firefly/ui/tap/TapKnownServices.js';
import {getFireflyViewerWebApiCommands} from 'firefly/api/webApiCommands/ViewerWebApiCommands.js';
import {
    makeLsstClickToAction, makeLsstTapEntry, LSST_DP02_DC2, LSST_DP03_SSO, makeLsstSiaEntry, LSST_DP02_SIAV2_DC2,
    RUBIN_DP02_DC2_ID, RUBIN_DP03_SSO_ID, RUBIN_LIVE_OBSCORE_ID, RUBIN_SIA_DP0_ID, getAlternateColorScheme
} from './actions.jsx';
import {getRubinDCECollectionAttributes, makeRubinDCERegistryRequest} from './RubinInventoryConfig';
import {RubinLanding, RubinLandingAPI} from './RubinLanding.jsx';

import APP_ICON from '../html/images/rubin-favicon-transparent-45px.png';
import './suit.css';

const OTHER_CAT= 'Other archive searches';

const RUBIN= 'Rubin searches';
const LSST_DP02_DC2_IMAGES= LSST_DP02_DC2+'-images';
const LSST_DP02_DC2_SIAV2_IMAGES= LSST_DP02_DC2+'-siaV2images';
// const LSST_DP03_SSO_IMAGES=LSST_DP03_SSO+'-images';

/**
 * This entry point is customized for LSST suit.  Refer to FFEntryPoint.js for information on
 * what could be used in defaults.
 */
let props = {
    showUserInfo: true,
    appIcon: <img src={APP_ICON} style={{width:36}}/>,
    showViewsSwitch: true,
    menu: [
        {label:'Data Collections', action:'RubinDataCollections', primary: menuItemPrimary,  category:RUBIN, enabled:menuItemEnabled},
        {label: 'DP0.2 Images', action: LSST_DP02_DC2_IMAGES, primary:menuItemPrimary, category:RUBIN,
            title: 'Search DP0.2 Images',  enabled:menuItemEnabled},
        {label: 'DP0.2 Images SIAv2', action: LSST_DP02_DC2_SIAV2_IMAGES, primary:menuItemPrimary, category:RUBIN,
            title: 'Search DP0.2 Images SIAv2',  enabled:menuItemEnabled},
        {label: 'DP0.2 Catalogs', action: LSST_DP02_DC2, primary:menuItemPrimary, category:RUBIN,
            title: 'Search DP0.2 catalogs',  enabled:menuItemEnabled},
        {label: 'DP0.3 Catalogs', action: LSST_DP03_SSO, primary:menuItemPrimary, category:RUBIN,
            title: 'Search DP0.3 catalogs', enabled:menuItemEnabled},
        {label:'Rubin HiPS Search', action: 'HiPSSearchPanel', primary: false, category:RUBIN,enabled:menuItemEnabled },

        {label: 'General TAP', action: 'TAPSearch', category:OTHER_CAT},
        {label: 'SIAv2 Searches', action: 'SIAv2Search', primary:false, category: OTHER_CAT},
        {label: 'IRSA Images', action: 'ImageSelectDropDownCmd', category: OTHER_CAT},
        {label: 'IRSA Catalogs', action: 'IrsaCatalog',  category:OTHER_CAT},
        {label: 'NED Objects', action: 'ClassicNedSearchCmd', primary: false, category:OTHER_CAT},
        {label: 'VO Cone Search', action: 'ClassicVOCatalogPanelCmd', primary: false, category: OTHER_CAT},
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
        <SIAv2SearchPanel lockService={true} lockedServiceName={LSST_DP02_SIAV2_DC2} groupKey='LSST_DP02_DC2_SIAV2_IMAGES'
                          layout= {{width: '100%'}}
                          lockTitle='DP0.2 Image Search via SIAv2 Search'
                          name={LSST_DP02_DC2_SIAV2_IMAGES}/>,
        // <TapSearchPanel lockService={true} lockedServiceName={LSST_DP03_SSO_IMAGES} groupKey={LSST_DP03_SSO_IMAGES}
        //                 lockObsCore={true}
        //                 layout= {{width: '100%'}}
        //                 name={LSST_DP03_SSO_IMAGES}/>,
        <DLGeneratedDropDown {...{
            name:'RubinDataCollections',
            key:'RubinDataCollections',
            registrySearchDef:{
                makeRegistryRequest:makeRubinDCERegistryRequest,
                getCollectionAttributes: getRubinDCECollectionAttributes,
                dataServiceId: 'rubin'
            },
        }}/>
    ],
};

const alwaysEnabled= [
        'TAPSearch', 'ImageSelectDropDownCmd', 'IrsaCatalog', 'ClassicNedSearchCmd', 'ClassicVOCatalogPanelCmd',
        'SIAv2Search', 'FileUploadDropDownCmd'];

const defPrimaryMenuList= [
    'RubinDataCollections', LSST_DP02_DC2_IMAGES, LSST_DP02_DC2_SIAV2_IMAGES, LSST_DP02_DC2, LSST_DP03_SSO,
];

const defEnabledMenuList= [
    'RubinDataCollections', LSST_DP02_DC2_IMAGES, LSST_DP02_DC2_SIAV2_IMAGES, LSST_DP02_DC2, LSST_DP03_SSO,
    'HiPSSearchPanel'
];


function menuItemEnabled(item) {
   const {rubinEnabledMenuItems:enabledList=[]}=  getAppOptions();
   if (!enabledList.length) return true;
   return [...enabledList,...alwaysEnabled].includes(item.action);
}

function menuItemPrimary(item) {
    const {rubinPrimaryMenuItems:primList=[]}=  getAppOptions();
    if (!primList.length) return true;
    return primList.includes(item.action);
}

// const LSST_TAP_LABEL= 'LSST DP0.2 DC2';

props = mergeObjectOnly(props, window.firefly?.app ?? {});

if (!props?.template) { // api mode
    props.landingPage= <RubinLandingAPI/>;
}



const tapServices=  [
    makeLsstTapEntry(),
    ...getTAPServicesByName( ['IRSA', 'Gaia', 'CADC', 'MASTImages', 'GAVO', 'HSA', 'NED',
        'VizieR', 'Simbad', 'ExoplanetArchive'])
];

const siaServices=  [
    makeLsstSiaEntry(),
    ...getSIAv2ServicesByName( ['IRSA', 'CADC']),
];

const rubinDataServiceOptions= {
    targetPanelExampleRow1: ['62, -37', '60.4 -35.1', '4h11m59s -32d51m59s equ j2000', '239.2 -47.6 gal'],
    targetPanelExampleRow2: ['NGC 1532', '(NB: DC2 is a simulated sky, so names are not useful)'],
    enableObsCoreDownload: false, //disable for the portal
    cutoutDefSizeDeg: .02,
    enableMetadataLoad: true, // loads metadata for columns to generate input field options
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
        tooltip: 'Name of instrument',
    },
    obsCoreSubType: {
        tooltip: 'Specific type of image or other dataset',
        helptext: '"lsst." + Butler Repo Dataset type'
    },
};



let options = {
    theme: {
        customized: () => ({
                ...defaultTheme(),
                fontFamily: {
                    display: 'Source Sans Pro, inter', // applies to `h1`–`h4`
                    body: 'Source Sans Pro, inter', // applies to `title-*` and `body-*`
                },
                DISABLED_colorSchemes: { ...getAlternateColorScheme()}
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
        hipsSource360URL : 'https://data-int.lsst.cloud/api/hips/images/color_gri',
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
    SIAv2 : {
        services: siaServices,
        defaultMaxrec: 50000
    },
    dataServiceOptions: {
        enableObsCoreDownload: true, // enable for other obscore
        preferCutout: false,
        ...rubinDataServiceOptions,
        [RUBIN_DP02_DC2_ID]  : {},
        [RUBIN_DP03_SSO_ID]  : {},
        [RUBIN_SIA_DP0_ID]  : {},
        [RUBIN_LIVE_OBSCORE_ID]  : {},
        'rubin'  : {},
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
        'lsstObsCoreTapTable', 'lsstTruthSummaryRadiusTable', 'showDatalinkTable'
    ],
    rubinEnabledMenuItems: defEnabledMenuList,
    rubinPrimaryMenuItems: defPrimaryMenuList,
    background : {
        history: {
            note: `
                Note: The jobs shown are associated with your user account and may include jobs submitted from other applications, not just this one. 
                You must be logged in to view your jobs. Only jobs created within the retention period will be displayed.
            `.trim(),
        }
    },
};

options = mergeObjectOnly(options, window.firefly?.options ?? {});
firefly.bootstrap(props, options,
    getFireflyViewerWebApiCommands(undefined,
        [
            {desc:LSST_DP02_DC2, name:LSST_DP02_DC2},
            {desc:LSST_DP02_DC2_IMAGES, name:LSST_DP02_DC2_IMAGES},
            {desc:LSST_DP03_SSO, name:LSST_DP03_SSO},
        ],
    ));
