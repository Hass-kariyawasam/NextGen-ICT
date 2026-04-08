import React from 'react';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/dashboard-lms' },
  { label: 'Courses', icon: <MenuBookRoundedIcon />, path: '/dashboard-lms/courses' },
  { label: 'My Courses', icon: <SchoolRoundedIcon />, path: '/dashboard-lms/my-courses' },
  { label: 'Resources', icon: <FolderRoundedIcon />, path: '/dashboard-lms/resources' },
  { label: 'Online', icon: <VideocamRoundedIcon />, path: '/dashboard-lms/online-class' },
  { label: 'Practical', icon: <ScienceRoundedIcon />, path: '/dashboard-lms/practical' },
  { label: 'Cart', icon: <ShoppingCartRoundedIcon />, path: '/dashboard-lms/cart' },
  { label: 'Settings', icon: <SettingsRoundedIcon />, path: '/dashboard-lms/settings' }
];

function SidebarContent({ onClose, compact = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logOut } = useAuth();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/dashboard-lms') {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Box 
      sx={{ 
        height: '100%', 
        borderRadius: { md: 0 }, 
        display: 'flex', 
        flexDirection: 'column', 
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      <Box sx={{ px: compact ? 1.5 : 2, py: 2.25, display: 'flex', alignItems: 'center', justifyContent: compact ? 'center' : 'space-between', borderBottom: '1px solid #e5e7eb' }}>
        <Box sx={{ display: 'flex', flexDirection: compact ? 'column' : 'row', alignItems: 'center', gap: 1.25 }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Avatar 
              sx={{ 
                width: 42, 
                height: 42, 
                background: '#0052cc',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#fff',
                border: '2px solid #e5e7eb'
              }}
            >
              N
            </Avatar>
          </motion.div>
          {!compact && (
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: '0.96rem', color: '#0f172a', lineHeight: 1.1 }}>NextGen</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>LMS</Typography>
            </Box>
          )}
        </Box>
        {!compact && onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: '#0f172a', '&:hover': { bgcolor: '#f8f9fa' } }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: compact ? 1 : 2, borderColor: '#e5e7eb' }} />

      <List sx={{ px: compact ? 1 : 1.5, py: 1.5, flexGrow: 1 }}>
        {NAV.map((item, idx) => {
          const active = isActive(item.path);
          const button = (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: compact ? 0 : 4 }}
              style={{ display: 'block' }}
            >
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  onClose?.();
                }}
                sx={{
                  mb: 1,
                  minHeight: compact ? 56 : 48,
                  justifyContent: 'center',
                  borderRadius: '6px',
                  background: active ? '#f0f4ff' : 'transparent',
                  color: active ? '#0052cc' : '#64748b',
                  transition: 'all 0.2s ease',
                  border: active ? '1px solid #e0e7ff' : '1px solid transparent',
                  fontWeight: active ? 700 : 600,
                  '&:hover': { 
                    background: active ? '#f0f4ff' : '#f8f9fa',
                    color: '#0052cc'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, color: 'inherit', justifyContent: 'center', fontSize: '1.3rem' }}>
                  {item.icon}
                </ListItemIcon>
                {!compact && (
                  <Typography sx={{ ml: 1.25, fontSize: '0.85rem', letterSpacing: 0.2, color: 'inherit' }}>
                    {item.label}
                  </Typography>
                )}
              </ListItemButton>
            </motion.div>
          );

          return (
            <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
              {compact ? <Tooltip title={item.label} placement="right">{button}</Tooltip> : button}
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ px: compact ? 1 : 1.5, py: 1.5, borderTop: '1px solid #e5e7eb' }}>
        <motion.div whileHover={{ x: compact ? 0 : 4 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{ 
              justifyContent: 'center', 
              borderRadius: '6px', 
              color: '#ef4444',
              transition: 'all 0.2s ease',
              '&:hover': { 
                background: 'rgba(239,68,68,0.1)',
                color: '#ef4444'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: 'inherit', justifyContent: 'center', fontSize: '1.3rem' }}>
              <LogoutRoundedIcon />
            </ListItemIcon>
            {!compact && <Typography sx={{ ml: 1.25, fontWeight: 700, fontSize: '0.85rem', color: 'inherit' }}>Logout</Typography>}
          </ListItemButton>
        </motion.div>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onClose, drawerWidth = 96 }) {
  return (
    <>
      <Box sx={{ width: drawerWidth, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
        <Box sx={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: drawerWidth, p: 1.25 }}>
          <SidebarContent compact />
        </Box>
      </Box>

      <Drawer
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 280, p: 1.5, bgcolor: '#ffffff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' } }}
      >
        <SidebarContent onClose={onClose} />
      </Drawer>
    </>
  );
}
