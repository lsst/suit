/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */


import {get} from 'lodash';

import {firefly} from 'firefly/Firefly.js';
import {timeSeriesButton} from './actions.jsx';
import {mergeObjectOnly} from 'firefly/util/WebUtil.js';
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

var options = {
    MenuItemKeys: {maskOverlay: true},
    imageTabs: ['fileUpload', 'url', '2mass', 'wise', 'sdss', 'msx', 'dss', 'iras'],
    irsaCatalogFilter: 'lsstFilter',
    catalogSpacialOp: 'polygonWhenPlotExist',
    // hips : {useForCoverage: false, useForImageSearch: true,
    //     hipsSources: 'all',
    //     defHipsSources: {source: 'irsa', label: 'Featured'},
    //     mergedListPriority: 'irsa'},
    tables : {
        showInfoButton: true // info about table : title, table links, etc.
    },
    tap : {
        services: [
            { label: 'LSST lsp-stable https://lsst-lsp-stable.ncsa.illinois.edu/api/tap',
                value: 'https://lsst-lsp-stable.ncsa.illinois.edu/api/tap' },
            { label: 'LSST lsp-int https://lsst-lsp-int.ncsa.illinois.edu/api/tap',
                value: 'https://lsst-lsp-int.ncsa.illinois.edu/api/tap' },
            { label: 'CADC https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap',
                value: 'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap' },
            { label: 'GAIA https://gea.esac.esa.int/tap-server/tap',
                value: 'https://gea.esac.esa.int/tap-server/tap' },
            { label: 'IRSA https://irsa.ipac.caltech.edu/TAP',
                value: 'https://irsa.ipac.caltech.edu/TAP' },
            { label: 'MAST https://vao.stsci.edu/CAOMTAP/TapService.aspx',
                value: 'https://vao.stsci.edu/CAOMTAP/TapService.aspx' },
            { label: 'NED https://ned.ipac.caltech.edu/tap',
                value: 'https://ned.ipac.caltech.edu/tap/' },
        ]
    }
};


props = mergeObjectOnly(props, get(window, 'firefly.app', {}));
options = mergeObjectOnly(options, get(window, 'firefly.options', {}));
firefly.bootstrap(props, options);
