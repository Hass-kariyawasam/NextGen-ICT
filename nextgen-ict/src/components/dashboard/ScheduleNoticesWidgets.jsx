import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CircularProgress, Divider, List, ListItem, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { mockNotices, mockSchedule } from '../../data/mockCourses';

function EmptyState({ title }) {
  return <Typography sx={{ color: 'var(--lms-text-secondary)', fontSize: '0.85rem' }}>{title}</Typography>;
}

export function ScheduleWidget() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'schedules'), orderBy('date', 'asc'), limit(5)),
      (snapshot) => {
        setItems(snapshot.empty ? mockSchedule : snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      () => {
        setItems(mockSchedule);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <Card 
        className="lms-panel" 
        sx={{ 
          borderRadius: '12px !important', 
          height: '100%',
          background: 'var(--lms-surface)',
          border: '1px solid var(--lms-border)',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            px: 2, 
            py: 2, 
            borderBottom: '1px solid var(--lms-border)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            background: 'var(--lms-primary-soft)'
          }}>
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <EventAvailableRoundedIcon sx={{ color: 'var(--lms-primary)', fontSize: '1.2rem' }} />
            </motion.div>
            <Typography sx={{ fontWeight: 700, color: 'var(--lms-text)', fontSize: '0.95rem' }}>Upcoming Schedule</Typography>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={28} sx={{ color: 'var(--lms-primary)' }} />
            </Box>
          ) : (
            <Box sx={{ p: 1.5 }}>
              {items.length ? items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ display: 'block' }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex',
                      gap: 1.5,
                      px: 1.25, 
                      py: 1.25,
                      borderRadius: '8px',
                      mb: index < items.length - 1 ? 0.75 : 0,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'var(--lms-primary-soft)',
                        borderLeft: '3px solid var(--lms-primary)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      minWidth: '48px', 
                      height: '48px', 
                      borderRadius: '8px', 
                      background: 'var(--lms-primary-soft)',
                      border: '1px solid var(--lms-border)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--lms-primary)',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}>
                      {item.date?.split('-')[2]}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--lms-text)' }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--lms-text-secondary)', mt: 0.25 }}>
                        {item.time || 'All day'} {item.course ? `• ${item.course}` : ''}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              )) : <Box sx={{ px: 2, py: 5, textAlign: 'center' }}><EmptyState title="No schedules available." /></Box>}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function NoticesWidget() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(5)),
      (snapshot) => {
        setItems(snapshot.empty ? mockNotices : snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      () => {
        setItems(mockNotices);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <Card 
        className="lms-panel" 
        sx={{ 
          borderRadius: '12px !important', 
          height: '100%',
          background: 'var(--lms-surface)',
          border: '1px solid var(--lms-border)',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            px: 2, 
            py: 2, 
            borderBottom: '1px solid var(--lms-border)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            background: 'rgba(255, 140, 0, 0.08)'
          }}>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <NotificationsRoundedIcon sx={{ color: 'var(--lms-accent)', fontSize: '1.2rem' }} />
            </motion.div>
            <Typography sx={{ fontWeight: 700, color: 'var(--lms-text)', fontSize: '0.95rem' }}>Notices</Typography>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={28} sx={{ color: 'var(--lms-accent)' }} />
            </Box>
          ) : (
            <Box sx={{ p: 1.5 }}>
              {items.length ? items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ display: 'block' }}
                >
                  <Box 
                    sx={{ 
                      px: 1.25, 
                      py: 1.25,
                      borderRadius: '8px',
                      mb: index < items.length - 1 ? 0.75 : 0,
                      borderLeft: '3px solid var(--lms-accent)',
                      background: 'rgba(255, 140, 0, 0.04)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 140, 0, 0.08)',
                        transform: 'translateX(2px)'
                      }
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--lms-text)', mb: 0.3 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'var(--lms-text-secondary)', mb: 0.3, lineHeight: 1.5 }}>
                      {item.message}
                    </Typography>
                    {item.date && (
                      <Typography sx={{ fontSize: '0.7rem', color: 'var(--lms-accent)', fontWeight: 500 }}>
                        {item.date}
                      </Typography>
                    )}
                  </Box>
                </motion.div>
              )) : <Box sx={{ px: 2, py: 5, textAlign: 'center' }}><EmptyState title="No notices available." /></Box>}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
