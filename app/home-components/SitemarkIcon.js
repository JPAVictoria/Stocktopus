'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

export default function SitemarkIcon() {
  const theme = useTheme();

  const lightImage = `url("/octopus.png")`;
  const darkImage = `url("/octopus-dark.png")`;

  return (
    <Box
      sx={(theme) => ({
        width: 210,
        height: 120,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: lightImage,
        ...theme.applyStyles?.('dark', {
          backgroundImage: darkImage,
        }),
      })}
    />
  );
}
