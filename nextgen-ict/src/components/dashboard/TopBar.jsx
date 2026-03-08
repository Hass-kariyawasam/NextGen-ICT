import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar, Box,
  Menu, MenuItem, ListItemIcon, Divider, Chip, Badge
} from '@mui/material';
import MenuRoundedIcon        from '@mui/icons-material/MenuRounded';
import PersonRoundedIcon      from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon    from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon      from '@mui/icons-material/LogoutRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import EmojiEventsRoundedIcon  from '@mui/icons-material/EmojiEventsRounded';
import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../../context/AuthContext';
import { useCart }     from '../../context/CartContext';

const EXAM_DATE = new Date('2026-08-10');
const daysLeft  = () => Math.max(0, Math.ceil((EXAM_DATE - new Date()) / 86400000));

export default function TopBar({ onMenuClick, pageTitle = 'Dashboard' }) {
  const { user, userData, logOut } = useAuth();
  const { cart }                   = useCart();
  const navigate                   = useNavigate();
  const [anchor, setAnchor]        = useState(null);

  // ── Real name from Firestore userData, fallback to Google displayName ──
  const displayName = userData?.name || user?.displayName || 'Student';
  const studentId   = userData?.studentId || '—';
  const firstLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setAnchor(null);
    await logOut();
    navigate('/');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{
      bgcolor: '#ffffff', borderBottom: '1px solid #f1f5f9',
      color: '#1e293b', zIndex: 1100
    }}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, gap: 2 }}>
        <IconButton onClick={onMenuClick} sx={{ display: { md: 'none' }, color: '#64748b' }}>
          <MenuRoundedIcon />
        </IconButton>

        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
          {pageTitle}
        </Typography>

        <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.85rem', color: '#94a3b8' }}>
          Hi,&nbsp;<strong style={{ color: '#2563EB' }}>{displayName.split(' ')[0]}</strong>&nbsp;👋
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Exam Countdown */}
        <Chip
          icon={<EmojiEventsRoundedIcon sx={{ fontSize: '0.9rem !important' }} />}
          label={`Exam in ${daysLeft()} days`}
          size="small"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            bgcolor: daysLeft() < 60 ? '#FEF3C7' : '#EFF6FF',
            color:   daysLeft() < 60 ? '#92400E' : '#1D4ED8',
            fontWeight: 600, fontSize: '0.72rem', border: 'none',
          }}
        />

        {/* Cart */}
        <IconButton onClick={() => navigate('/dashboard-lms/cart')} sx={{ color: '#64748b' }}>
          <Badge badgeContent={cart.length} color="primary">
            <ShoppingCartRoundedIcon />
          </Badge>
        </IconButton>

        {/* Avatar */}
        <IconButton onClick={e => setAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
          <Avatar sx={{
            width: 36, height: 36, bgcolor: '#2563EB',
            fontSize: '0.875rem', fontWeight: 700,
            boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
          }}>
            {firstLetter}
          </Avatar>
        </IconButton>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
          PaperProps={{ sx: {
            mt: 1, minWidth: 210, borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid #f1f5f9'
          }}}
        >
          <Box sx={{ px: 2.5, py: 1.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
              {displayName}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {user?.email}
            </Typography>
            {userData?.studentId && (
              <Typography sx={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 600, mt: 0.3 }}>
                ID: {studentId}
              </Typography>
            )}
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchor(null); navigate('/dashboard-lms/settings'); }}>
            <ListItemIcon><PersonRoundedIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { setAnchor(null); navigate('/dashboard-lms/settings'); }}>
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