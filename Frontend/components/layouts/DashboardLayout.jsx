import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext) || {};

  console.log("User:", user);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeMenu={activeMenu} />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <SideMenu activeMenu={activeMenu} />
        </div>

        {/* Main content */}
        <div className="grow mx-5 mt-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
