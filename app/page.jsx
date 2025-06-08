import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from './shared-theme/AppTheme';
import AppAppBar from './home-components/AppAppBar';
import Hero from './home-components/Hero';
import Features from './home-components/Features';
import Adminsteps from './home-components/Adminsteps';
import FAQ from './home-components/FAQ';
import Footer from './home-components/Footer';

export default function MarketingPage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <Features />
        <Divider />
        <Adminsteps />
        <Divider />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}