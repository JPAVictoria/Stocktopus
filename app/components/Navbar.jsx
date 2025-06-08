'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@mui/material';
import {
  BarChart2,
  Grid,
  Home,
  LogOut
} from 'lucide-react';
import axios from 'axios';
import { useSnackbar } from '@/app/context/SnackbarContext';
import { useLoading } from '@/app/context/LoaderContext';

export default function Navbar() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { setLoading } = useLoading();

  const iconClasses =
    'text-[#333333] hover:text-[#ffa408] transition-colors duration-300 w-6 h-6 cursor-pointer';

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/logout');
      openSnackbar('Logged out successfully', 'success');
      router.push('/pages/login');
    } catch (error) {
      openSnackbar('Failed to logout', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-1/2 left-10 -translate-y-1/2 h-[340px] w-15 bg-white border border-[#2D2D2D]/25 rounded-lg flex flex-col justify-between items-center py-12">
      <div className="flex flex-col items-center gap-13">
        <Tooltip title="Dashboard" placement="right">
          <Link href="/pages/dashboard">
            <div className={iconClasses}>
              <BarChart2 />
            </div>
          </Link>
        </Tooltip>

        <Tooltip title="Products" placement="right">
          <Link href="/pages/product">
            <div className={iconClasses}>
              <Grid />
            </div>
          </Link>
        </Tooltip>

        <Tooltip title="Inventory Locations" placement="right">
          <Link href="/pages/inventory">
            <div className={iconClasses}>
              <Home />
            </div>
          </Link>
        </Tooltip>

        <Tooltip title="Logout" placement="right">
          <div
            onClick={handleLogout}
            className={iconClasses}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
          >
            <LogOut />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
