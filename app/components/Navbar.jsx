'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@mui/material';
import {
  BarChart2,
  Grid,
  Home,
  Settings,
  LogOut
} from 'lucide-react';
import axios from 'axios';
import { useSnackbar } from '@/app/context/SnackbarContext';
import { useLoading } from '@/app/context/LoaderContext';

export default function Navbar() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const { loading, setLoading } = useLoading();

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
    <div className="fixed top-1/2 left-10 -translate-y-1/2 h-[380px] w-15 bg-white border border-[#2D2D2D]/25 rounded-lg flex flex-col justify-between items-center py-12">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <svg
            className="animate-spin h-12 w-12 text-[#2F27CE]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
      )}

      <div className="flex flex-col items-center gap-10">
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

        <Tooltip title="Audit Logs" placement="right">
          <Link href="/pages/audit">
            <div className={iconClasses}>
              <Settings />
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
