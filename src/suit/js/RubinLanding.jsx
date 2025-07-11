import {Box, Stack, SvgIcon, Typography} from '@mui/joy';
import React from 'react';
import PORTAL_SYMBOL from '../html/images/portal-symbol.svg';
import {LandingPage} from 'firefly/templates/fireflyviewer/LandingPage';


const RubinBranding = ({}) => (
    <Stack alignItems='center'>
        <Typography sx={{fontSize: 'xl4'}} color='neutral'>
            Rubin Science Platform Portal
        </Typography>
    </Stack>
);

const Api = ({}) => (
    <Stack alignItems='center'>
        <Typography sx={{fontSize: 'xl4'}} color='neutral'>
            Firefly Ready
        </Typography>
    </Stack>
);

const Logo= () => (
    <Box sx={{width:'12rem',height:'12rem'}}>
        <SvgIcon component={PORTAL_SYMBOL} viewBox='0 -50 940 950' sx={{width:1,height:1}}/>
    </Box>
);

export function RubinLanding() {
    return (
        <LandingPage
            slotProps={{
                topSection: {component: RubinBranding},
                // bottomSection: {icon: <img src={PORTAL_SYMBOL} alt={'Rubin Portal Symbol'} style={{width: '14rem'}}/>}
                bottomSection: {icon: <Logo/>}
        }}/>
    );
}

export function RubinLandingAPI() {
    return (
        <LandingPage
            slotProps={{
                topSection: {component: Api},
                bottomSection: {
                    icon: <Logo/>,
                    text: '',
                    subtext: 'Awaiting Python API Commands',
                    summaryText:
                        (<Stack alignItems='center'>
                            <div>Visualizations of the results will appear in this tab</div>
                            <div>Portal searches are also available from the tabs above</div>
                        </Stack>),
                    actionItems: [
                        {text: '', subtext: ''},
                        { text: '', subtext: '' },
                        { text: '', subtext: '' },
                    ],
                }
            }}/>
    );
}
