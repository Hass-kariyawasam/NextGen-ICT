import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { formatRemainingDays } from '../../utils/courseHelpers';

export default function ExamCountdownWidget() {
  const [examDate, setExamDate] = useState('2026-08-10');
  const [days, setDays] = useState(formatRemainingDays('2026-08-10'));

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'settings'), (snapshot) => {
      if (!snapshot.empty) {
        const settings = snapshot.docs[0].data();
        if (settings.examDate) {
          setExamDate(settings.examDate);
          setDays(formatRemainingDays(settings.examDate));
        }
      }
    });

    const timer = setInterval(() => setDays(formatRemainingDays(examDate)), 60000);
    return () => {
      unsub();
      clearInterval(timer);
    };
  }, [examDate]);

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
          background: 'linear-gradient(135deg, var(--lms-primary) 0%, #0066ff 100%)',
          color: '#fff',
          overflow: 'hidden',
          position: 'relative',
          border: 'none'
        }}
      >
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <CalendarMonthRoundedIcon sx={{ fontSize: '1.3rem', opacity: 0.9 }} />
            </motion.div>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: 0.3, opacity: 0.95 }}>EXAM COUNTDOWN</Typography>
          </Box>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography sx={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, mb: 0.25 }}>
              {Math.max(days, 0)}
            </Typography>
          </motion.div>
          <Typography sx={{ fontSize: '0.9rem', opacity: 0.9, mb: 2.5, fontWeight: 500 }}>days left</Typography>
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400 }}>
            <Box sx={{ 
              p: 1.75, 
              borderRadius: '10px', 
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease'
            }}>
              <Typography sx={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: 600, mb: 0.3 }}>Exam date</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{new Date(examDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
            </Box>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
