/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */


import {get} from 'lodash';

import {firefly, Templates} from 'firefly/Firefly.js';
// import {HELP_LOAD} from 'firefly/core/AppDataCntlr.js';


/**
 * This entry point is customized for LSST suit.  Refer to FFEntryPoint.js for information on 
 * what could be used in defaults.
 */
const defaults = {
    div: 'app',
    appTitle: '',
    appIcon: 'images/lsst_logo.png',
    template: 'FireflyViewer',
    menu: [
        {label: 'LSST Data', action: 'LsstCatalogDropDown'},
        {label: 'External Images', action: 'ImageSelectDropDownCmd'},
        {label: 'External Catalogs', action: 'IrsaCatalogDropDown'},
        {label: 'Add Chart', action: 'ChartSelectDropDownCmd'}
    ], 
    options: {
        MenuItemKeys: {maskOverlay: true},
        imageTabs: ['fileUpload', 'url', '2mass', 'wise', 'sdss', 'msx', 'dss', 'iras'],
        irsaCatalogFilter: 'lsstFilter',
        catalogSpacialOp: 'polygonWhenPlotExist'
    }
};

const app = get(window, 'firefly.app', {});
const options = Object.assign({}, defaults.options, app.options);

var viewer, props;
if (app) {
    props = Object.assign({}, defaults, app);
    viewer = Templates[props.template];
}

firefly.bootstrap(options, viewer, props);
