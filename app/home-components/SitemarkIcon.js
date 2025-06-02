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





// 'use client';

// import * as React from 'react';
// import SvgIcon from '@mui/material/SvgIcon';
// import { useTheme } from '@mui/material/styles';

// const theme = useTheme();

//   const lightImage = `url("/octopus.png")`;
//   const darkImage = `url("/octopus-dark.png")`;

// export default function SitemarkIcon() {
//   return (
//     <SvgIcon
//       sx={{ height: 70, width: 160, mr: 2 }}
//       component="svg"
//       viewBox="0 0 140 70"
//     >
//       <image
//         href="/icon.png" // Use forward slashes and a correct relative or public path
//         width="150"
//         height="70"
//         preserveAspectRatio="xMidYMid meet"
//       />
//     </SvgIcon>
//   );
// }
