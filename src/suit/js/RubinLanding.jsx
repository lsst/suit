import {Stack, Typography} from '@mui/joy';
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

export function RubinLanding() {
    return (
        <LandingPage
            slotProps={{
                topSection: {component: RubinBranding},
                bgMonitorHint: {sx: {right: 80}},
                bottomSection: {icon: <img src={PORTAL_SYMBOL} alt={'Rubin Portal Symbol'} style={{width: '14rem'}}/>}
        }}/>
    );
}

export function RubinLandingAPI() {
    return (
        <LandingPage
            slotProps={{
                topSection: {component: Api},
                bgMonitorHint: {sx: {right: 80}},
                bottomSection: {
                    icon: <img src={PORTAL_SYMBOL} alt={'Rubin Portal Symbol'} style={{width: '14rem'}}/>,
                    text: '',
                    subtext: 'Awaiting Python API Commands',
                    actionItems: [
                        { text: '', subtext: '' },
                        { text: '', subtext: '' },
                        { text: '', subtext: '' },
                    ],
                }
            }}/>
    );
}
