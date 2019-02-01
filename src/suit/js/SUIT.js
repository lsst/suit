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
        {label: 'LSST Data', action: 'LsstCatalogDropDown'},
        {label: 'External Images', action: 'ImageSelectDropDownCmd'},
        {label: 'External Catalogs', action: 'IrsaCatalogDropDown'},
        {label: 'Add Chart', action: 'ChartSelectDropDownCmd'}
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
    //     mergedListPriority: 'irsa'}
};


props = mergeObjectOnly(props, get(window, 'firefly.app', {}));
options = mergeObjectOnly(options, get(window, 'firefly.options', {}));
firefly.bootstrap(props, options);
