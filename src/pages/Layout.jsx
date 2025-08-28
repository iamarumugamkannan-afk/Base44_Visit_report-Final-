import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createPageUrl } from "@/utils";
import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  const handleLogout = async () => {
    await logout();
  };

  return (
  );
}