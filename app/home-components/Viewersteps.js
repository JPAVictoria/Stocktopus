'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LooksOneRoundedIcon from '@mui/icons-material/LooksOneRounded';
import LooksTwoRoundedIcon from '@mui/icons-material/LooksTwoRounded';
import Looks3RoundedIcon from '@mui/icons-material/Looks3Rounded';
import Looks4RoundedIcon from '@mui/icons-material/Looks4Rounded';


const items = [
  {
    icon: <LooksOneRoundedIcon />,
    title: 'Learn More',
    description: (
      <>
        Click the arrow icon inside a content card to dive deeper into any content and view its full details on a dedicated page.
      </>
    ),
  },
  {
    icon: <LooksTwoRoundedIcon />,
    title: 'Filter by Category',
    description: (
      <>
        Customize your dashboard view by selecting specific categories that match your interests. 
      </>
    ),
  },
  {
    icon: <Looks3RoundedIcon />,
    title: 'Add to Favorites',
    description: (
      <>
        Like content to save it for later—your favorites are just a heart away.
      </>
    ),
  },
  {
    icon: <Looks4RoundedIcon />,
    title: 'Personalize Your Profile',
    description: (
      <>
        Update your name and password anytime to keep your account secure and uniquely yours.
      </>
    ),
  },
];

export default function Viewersteps() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'text.primary',
      }}
    >

      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Viewer Guide: How to Engage with Content
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Explore, interact, and personalize your experience with ease. Our platform is designed to help you discover 
            food content that matters to you—while giving you the tools to tailor your dashboard and preferences.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'text.secondary',
                  backgroundColor: 'mode.primary',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
      <section id='faq'></section>
    </Box>
  );
}
