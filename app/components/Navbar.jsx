'use client';

import Link from 'next/link';
import { Tooltip } from '@mui/material';
import {
  BarChart2,
  Grid,
  Home,
  Settings,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const iconClasses =
    'text-[#333333] hover:text-[#0056B3] transition-colors duration-300 w-6 h-6 cursor-pointer';

  return (
    <div className="fixed top-1/2 left-10 -translate-y-1/2 h-[380px] w-15 bg-white border border-[#2D2D2D]/25 rounded-lg flex flex-col justify-between items-center py-12">
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
          <Link href="/pages/logout">
            <div className={iconClasses}>
              <LogOut />
            </div>
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}
