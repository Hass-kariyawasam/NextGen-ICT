import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { Timer as TimerIcon, Event as EventIcon } from '@mui/icons-material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function ExamCountdownWidget() {
  const [examDate, setExamDate] = useState('2026-02-28'); // Default
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamDate();
  }, []);

  useEffect(() => {
    calculateDaysRemaining();
    // Update countdown every hour
    const interval = setInterval(calculateDaysRemaining, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [examDate]);

  const fetchExamDate = async () => {
    try {
      const snap = await getDocs(collection(db, 'settings'));
      if (!snap.empty) {
        const settings = snap.docs[0].data();
        if (settings.examDate) {
          setExamDate(settings.examDate);
        }
      }
    } catch (error) {
      console.error('Error fetching exam date:', error);
    }
    setLoading(false);
  };

  const calculateDaysRemaining = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setDaysRemaining(diffDays);
  };

  const formatExamDate = () => {
    const date = new Date(examDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return null;

  return (
    <Card
      sx={{
        borderRadius: '16px',
        background: daysRemaining <= 30 
          ? 'linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)'
          : daysRemaining <= 60
          ? 'linear-gradient(135deg, #F6AD55 0%, #ED8936 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(40px)'
        }}
      />
      
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <EventIcon sx={{ fontSize: '1.2rem' }} />
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>
            A/L ICT Exam
          </Typography>
        </Box>

        {/* Days Remaining - Large Display */}
        <Box sx={{ textAlign: 'center', my: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 1 }}>
            <Typography
              sx={{
                fontSize: '4rem',
                fontWeight: 900,
                lineHeight: 1,
                textShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              {daysRemaining >= 0 ? daysRemaining : 0}
            </Typography>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, opacity: 0.9 }}>
              {daysRemaining === 1 ? 'day' : 'days'}
            </Typography>
          </Box>
          
          <Typography sx={{ fontSize: '0.9rem', mt: 1, opacity: 0.9 }}>
            {daysRemaining > 0 ? 'remaining' : daysRemaining === 0 ? 'TODAY!' : 'completed'}
          </Typography>
        </Box>

        {/* Exam Date */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', opacity: 0.8, mb: 0.5 }}>
            Exam Date
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 700 }}>
            {formatExamDate()}
          </Typography>
        </Box>

        {/* Urgency Indicator */}
        {daysRemaining > 0 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            {daysRemaining <= 7 && (
              <Chip
                icon={<TimerIcon />}
                label="FINAL WEEK!"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  fontWeight: 700,
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
              />
            )}
            {daysRemaining > 7 && daysRemaining <= 30 && (
              <Chip
                label="Less than a month"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontWeight: 600
                }}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
