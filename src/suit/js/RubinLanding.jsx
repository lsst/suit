import {Stack, Typography} from '@mui/joy';
import React from 'react';
import PORTAL_SYMBOL from '../html/images/portal-symbol.svg';
import {LandingPage} from 'firefly/templates/fireflyviewer/LandingPage';


export function RubinLanding() {
    return (
        <LandingPage
            slots={{
                topSection: (
                    <Stack alignItems='center'>
                        <Typography sx={{fontSize: 'xl4'}} color='neutral'>
                            Rubin Science Platform Portal
                        </Typography>
                    </Stack>
                )}}
            slotProps={{
                bgMonitorHint: {sx: {right: 80}},
                bottomSection: {icon: <img src={PORTAL_SYMBOL} alt={'Rubin Portal Symbol'} style={{width: '14rem'}}/>}
        }}/>
    );
}