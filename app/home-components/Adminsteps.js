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
import Looks5RoundedIcon from '@mui/icons-material/Looks5Rounded';
import Looks6RoundedIcon from '@mui/icons-material/Looks6Rounded';

const adminitems = [
  {
    icon: <LooksOneRoundedIcon />,
    title: '🆕 Create Product',
    description: (
      <>
        Register a <strong>new product</strong> by entering its name, image, quantity, price, and inventory location.


      </>
    ),
  },
  {
    icon: <LooksTwoRoundedIcon />,
    title: '📦 Create Inventory',
    description: (
      <>
        Set up <strong>warehouses</strong> or <strong>storage locations</strong> to organize where your products are kept.
      </>
    ),
  },
  {
    icon: <Looks3RoundedIcon />,
    title: '➕ Add Product',
    description: (
      <>
        Add <strong>new stock</strong> to a specific location to keep your inventory updated.
      </>
    ),
  },
  {
    icon: <Looks4RoundedIcon />,
    title: '➖ Subtract Product',
    description: (
      <>
        <strong>Reduce</strong> stock quantities for sales, damages, or losses to maintain accuracy.
      </>
    ),
  },
  {
    icon: <Looks5RoundedIcon />,
    title: '🔁 Transfer Product',
    description: (
      <>
        
            <strong>Move stock</strong> between locations to manage inventory across branches easily.
        
      </>
    ),
  },
  {
    icon: <Looks6RoundedIcon />,
    title: '✏️ Update Product',
    description: (
      <>
        <strong>Edit</strong> product details or correct inventory info to keep records accurate.
      </>
    ),
  },
];


export default function Adminsteps() {
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
            🐙 Welcome to Stocktopus: Smarter Inventory Starts Here
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            A simple, powerful system to organize, track, and optimize your stock with ease. Learn the essential tools to manage your inventory quickly and confidently!
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {adminitems.map((item, index) => (
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
      <section id='viewer'></section>

    </Box>
  );
}
