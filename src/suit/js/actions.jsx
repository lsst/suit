import {makeSearchAction, SearchTypes} from 'firefly/core/ClickToAction.js';
import {showTapSearchPanel} from 'firefly/ui/DefaultSearchActions.js';
import {getTapServices} from 'firefly/ui/tap/TapUtil.js';
import {makeWorldPt} from 'firefly/visualize/Point.js';

export const LSST_DP02_DC2= 'LSST DP0.2 DC2';
export const RUBIN_DP02_DC2_ID= 'RubinDp02Dc2';
export const RUBIN_SIA_DP0_ID= 'RubinSiaDp02Dc2';
// export const LSST_DP03_SSP_ID= 'RubinDp03SSO';
export const LSST_DP03_SSO='LSST DP0.3 SSO';
export const RUBIN_DP03_SSO_ID='RubinDp03SSO';

// "LSST Live ObsCore"
export const RUBIN_LIVE_OBSCORE_ID=  'RubinLiveObsCore';


export const LSST_DP02_SIAV2_DC2= 'LSST SIAV2 DP0.2 DC2';
export const LSST_DP02_SIAV2_DC2_ID= 'RubinSiaDp02Dc2';

function getLsstTapServiceUrl() {
    const url= getTapServices().filter( ({label}) => label===LSST_DP02_DC2)?.[0]?.value;
    return url;
}

export function makeLsstClickToAction() {

    return [
        makeSearchAction('lsstObsCoreTap', 'lsst-tap', 'ObsTAP for Images', 'Search ObsTAP', SearchTypes.point, .001, 2.25,
            (sa, cenWpt, radius) => {
                showTapSearchPanel( {wp: cenWpt, serviceUrl: getLsstTapServiceUrl(),
                    schema:'ivoa', table:'ivoa.ObsCore'});
            }),
        makeSearchAction('lsstTruthSummaryRadius', 'lsst-tap', 'Truth Summary TAP ', 'Search truth summary', SearchTypes.pointRadius, .001, 2.25,
            (sa, cenWpt, radius) => {
                showTapSearchPanel( {wp: cenWpt, radiusInArcSec: radius, serviceUrl: getLsstTapServiceUrl(),
                    schema:'dp02_dc2_catalogs', table:'dp02_dc2_catalogs.TruthSummary'});
            }),
        makeSearchAction('lsstTruthSummaryArea', 'lsst-tap', 'Truth Summary TAP ', 'Search truth summary', SearchTypes.area, undefined, undefined,
            (sa, cenWpt, radius, corners) => {
                showTapSearchPanel( {corners, serviceUrl: getLsstTapServiceUrl(),
                    schema:'dp02_dc2_catalogs', table:'dp02_dc2_catalogs.TruthSummary'});
            }, 'Search TruthSummary table within the specified polygon'),
        makeSearchAction('lsstObsCoreTapTable', 'lsst-tap', 'Obscore TAP', 'TAP Search',
            SearchTypes.point_table_only, undefined, undefined,
            (sa, wp) => showTapSearchPanel( {wp, serviceUrl: getLsstTapServiceUrl(), schema:'ivoa', table:'ivoa.ObsCore'}),
            'Search ObsTAP for images at row'),
        makeSearchAction('lsstTruthSummaryRadiusTable', 'lsst-tap', 'TAP', 'Truth Summary TAP',
            SearchTypes.point_table_only, undefined, undefined,
            (sa, wp) => showTapSearchPanel( {wp, radiusInArcSec: 5/3600,
                serviceUrl: getLsstTapServiceUrl(), schema:'dp02_dc2_catalogs', table:'dp02_dc2_catalogs.TruthSummary'}),
            'Search Truth Summary table with 5" radius' ),
    ];
}




export function makeLsstTapEntry() {

    return (
        {
            serviceId: RUBIN_DP02_DC2_ID,
            label: LSST_DP02_DC2,
            value: 'https://data-int.lsst.cloud/api/tap',
            fovDeg: 10,
            centerWP: makeWorldPt(62,-37).toString(),
             // hipsUrl: 'https://data-int.lsst.cloud/api/hips/images/color_gri',
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
};




export function makeLsstSiaEntry() {
    return (
        {
            serviceId: LSST_DP02_SIAV2_DC2_ID,
            label: LSST_DP02_SIAV2_DC2,
            value: 'https://data-int.lsst.cloud/api/sia/dp02/query',
            fovDeg: 10,
            centerWP: makeWorldPt(62,-37).toString(),
            metaOptions: [
                {
                    name: 'CALIB',
                    options: '0,1,2,3,4',
                    optionNames: 'Not Used,Raw Data,PVIs,Coadds and Difference Images,Not Used'
                }
            ],
        }
    );


}

export const getAlternateColorScheme= () => ({
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
});
