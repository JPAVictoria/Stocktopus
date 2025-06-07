'use client';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ColorModeIconDropdown from '@/app/shared-theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';



export default function AppAppBar() {
  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '2px 20px',
}));

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};




  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="md">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', pl: 0, ml: -3 }}>
            <Box
              sx={{
                height: 70, // keep toolbar height steady
                overflow: 'visible',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  transform: 'scale(1.5)', // enlarge the logo
                  transformOrigin: 'center',
                }}
              >
                <Sitemark />
              </Box>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small" onClick={() => scrollToSection('feature')}>
                Features
              </Button>
              <Button variant="text" color="info" size="small" onClick={() => scrollToSection('admin')}>
                User's Guide
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={() => scrollToSection('faq')}>
                FAQs
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >

            <ColorModeIconDropdown />
          </Box>

        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
