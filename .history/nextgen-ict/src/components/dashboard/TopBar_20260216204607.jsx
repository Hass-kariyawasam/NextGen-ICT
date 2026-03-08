import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar, Box,
  Menu, MenuItem, ListItemIcon, Divider, Chip, Badge
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NEXT_EXAM = new Date('2026-12-05');

function getDaysUntilExam() {
  const today = new Date();
  const diff = Math.ceil((NEXT_EXAM - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function TopBar({ onMenuClick, pageTitle = 'Dashboard' }) {
  const { currentUser, userData, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const displayName = userData?.name || currentUser?.displayName || 'Student';
  const studentId = userData?.studentId || userData?.email?.split('@')[0]?.toUpperCase() || 'N/A';
  const daysLeft = getDaysUntilExam();

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        color: '#1e293b',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, gap: 2 }}>
        {/* Mobile menu */}
        <IconButton
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, color: '#64748b' }}
        >
          <MenuRoundedIcon />
        </IconButton>

        {/* Page title */}
        <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#1e293b' }}>
          {pageTitle}
        </Typography>

        {/* Greeting */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', ml: 1 }}>
          <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Hi,&nbsp;
            <span style={{ color: '#2563EB', fontWeight: 600 }}>{displayName.split(' ')[0]}</span>
            &nbsp;👋
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Exam countdown */}
        <Chip
          icon={<EmojiEventsRoundedIcon sx={{ fontSize: '1rem !important' }} />}
          label={`Exam: ${daysLeft} days`}
          size="small"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            bgcolor: daysLeft < 30 ? '#FEF3C7' : '#EFF6FF',
            color: daysLeft < 30 ? '#92400E' : '#1D4ED8',
            fontWeight: 600,
            fontSize: '0.75rem',
            border: 'none',
          }}
        />

        {/* Cart */}
        <IconButton
          onClick={() => navigate('/dashboard-lms/cart')}
          sx={{ color: '#64748b' }}
        >
          <Badge badgeContent={cart.length} color="primary">
            <ShoppingCartRoundedIcon />
          </Badge>
        </IconButton>

        {/* Profile Avatar */}
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
          <Avatar
            sx={{
              width: 36, height: 36, bgcolor: '#2563EB',
              fontSize: '0.875rem', fontWeight: 700,
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              mt: 1, minWidth: 200,
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #f1f5f9'
            }
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{displayName}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              ID: {studentId}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/dashboard-lms/settings'); }}>
            <ListItemIcon><PersonRoundedIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/dashboard-lms/settings'); }}>
            <ListItemIcon><SettingsRoundedIcon fontSize="small" /></ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
            <ListItemIcon><LogoutRoundedIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}