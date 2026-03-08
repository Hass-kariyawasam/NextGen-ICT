import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, List, ListItem,
  ListItemText, Chip, Divider, Alert, CircularProgress
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  LiveTv as LiveIcon,
  Assignment as ExamIcon,
  Code as PracticalIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';

// ===== SCHEDULE WIDGET =====
export function ScheduleWidget() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const q = query(
        collection(db, 'schedules'),
        orderBy('date', 'asc'),
        limit(5)
      );
      const snap = await getDocs(q);
      const schedulesList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Filter only upcoming schedules
      const today = new Date().toISOString().split('T')[0];
      const upcoming = schedulesList.filter(s => s.date >= today);
      
      setSchedules(upcoming);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      // If schedules collection doesn't exist, use empty array
      setSchedules([]);
    }
    setLoading(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'live': return <LiveIcon sx={{ fontSize: '1.1rem' }} />;
      case 'exam': return <ExamIcon sx={{ fontSize: '1.1rem' }} />;
      case 'practical': return <PracticalIcon sx={{ fontSize: '1.1rem' }} />;
      default: return <ScheduleIcon sx={{ fontSize: '1.1rem' }} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'live': return { bg: '#EFF6FF', color: '#2563EB' };
      case 'exam': return { bg: '#FFF7ED', color: '#C2410C' };
      case 'practical': return { bg: '#F0FDF4', color: '#15803D' };
      default: return { bg: '#F8FAFC', color: '#64748b' };
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', p: 3 }}>
        <CircularProgress size={24} />
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ScheduleIcon sx={{ color: '#2563EB', fontSize: '1.3rem' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
                Upcoming Schedule
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {schedules.length} upcoming {schedules.length === 1 ? 'event' : 'events'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Schedule List */}
        <List sx={{ p: 1 }}>
          {schedules.length === 0 ? (
            <ListItem>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', py: 2 }}>
                    No upcoming events scheduled
                  </Typography>
                }
              />
            </ListItem>
          ) : (
            schedules.map((schedule, index) => {
              const typeStyle = getTypeColor(schedule.type);
              return (
                <React.Fragment key={schedule.id}>
                  <ListItem
                    sx={{
                      borderRadius: '12px',
                      mb: 0.5,
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: '#F8FAFC' }
                    }}
                  >
                    <Box sx={{ mr: 2, textAlign: 'center', minWidth: 60 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                        {formatDate(schedule.date).split(' ')[0]} {/* Weekday */}
                      </Typography>
                      <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                        {formatDate(schedule.date).split(' ')[2]} {/* Day */}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {formatDate(schedule.date).split(' ')[1]} {/* Month */}
                      </Typography>
                    </Box>
                    
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                          {schedule.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                            ⏰ {schedule.time}
                          </Typography>
                          {schedule.course && (
                            <>
                              <Typography sx={{ color: '#e2e8f0' }}>•</Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                                {schedule.course}
                              </Typography>
                            </>
                          )}
                        </Box>
                      }
                    />
                    
                    <Chip
                      icon={getTypeIcon(schedule.type)}
                      label={schedule.type}
                      size="small"
                      sx={{
                        bgcolor: typeStyle.bg,
                        color: typeStyle.color,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        textTransform: 'capitalize'
                      }}
                    />
                  </ListItem>
                  {index < schedules.length - 1 && <Divider sx={{ mx: 2 }} />}
                </React.Fragment>
              );
            })
          )}
        </List>
      </CardContent>
    </Card>
  );
}

// ===== NOTICES WIDGET =====
export function NoticesWidget() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const q = query(
        collection(db, 'notices'),
        orderBy('createdAt', 'desc'),
        limit(4)
      );
      const snap = await getDocs(q);
      setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error fetching notices:', error);
      // If notices collection doesn't exist, use empty array
      setNotices([]);
    }
    setLoading(false);
  };

  const getNoticeIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '🚨';
      default: return 'ℹ️';
    }
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', p: 3 }}>
        <CircularProgress size={24} />
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: '#FFF7ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <NotificationsIcon sx={{ color: '#C2410C', fontSize: '1.3rem' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
                Recent Notices
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Important announcements
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Notices List */}
        <Box sx={{ p: 2 }}>
          {notices.length === 0 ? (
            <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', py: 2 }}>
              No notices available
            </Typography>
          ) : (
            notices.map((notice) => (
              <Alert
                key={notice.id}
                severity={notice.type || 'info'}
                icon={<span style={{ fontSize: '1.2rem' }}>{getNoticeIcon(notice.type)}</span>}
                sx={{
                  mb: 1.5,
                  borderRadius: '12px',
                  '& .MuiAlert-message': {
                    width: '100%'
                  },
                  '&:last-child': {
                    mb: 0
                  }
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>
                  {notice.title}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                  {notice.message}
                </Typography>
                {notice.date && (
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', mt: 0.5 }}>
                    {new Date(notice.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Typography>
                )}
              </Alert>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
