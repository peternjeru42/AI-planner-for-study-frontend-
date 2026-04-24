'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { authApi } from '@/lib/api';
import { tokenStorage } from '@/lib/api/storage';
import { StudyPreferences, User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  profile: StudyPreferences | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<User>;
  refreshUser: () => Promise<void>;
  updateAuthState: (nextUser: User, nextProfile: StudyPreferences | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const guestUser: User = {
  id: 'guest',
  name: 'Guest Student',
  email: 'guest@example.com',
  role: 'student',
  enrollmentDate: new Date(),
  isActive: true,
  isVerified: true,
};

const guestProfile: StudyPreferences = {
  userId: 'guest',
  courseName: 'General Studies',
  yearOfStudy: 1,
  institutionName: '',
  timezone: 'Africa/Nairobi',
  startTime: '08:00',
  endTime: '22:00',
  sessionLength: 60,
  breakLength: 15,
  maxSessionsPerDay: 6,
  weekendAvailable: true,
  enableInAppNotifications: true,
  enableEmailNotificationsSimulated: true,
  darkMode: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(guestUser);
  const [profile, setProfile] = useState<StudyPreferences | null>(guestProfile);
  const [isLoading, setIsLoading] = useState(true);

  const updateAuthState = (nextUser: User, nextProfile: StudyPreferences | null) => {
    setUser(nextUser);
    setProfile(nextProfile);
  };

  const refreshUser = async () => {
    try {
      const payload = await authApi.me();
      setUser(payload.user);
      setProfile(payload.profile ?? guestProfile);
    } catch {
      setUser(guestUser);
      setProfile(guestProfile);
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        await refreshUser();
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const payload = await authApi.login(email, password);
      setUser(payload.user);
      setProfile(payload.profile);
      return payload.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      tokenStorage.clear();
      setUser(guestUser);
      setProfile(guestProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<User> => {
    setIsLoading(true);
    try {
      const payload = await authApi.signup(email, password, name);
      setUser(payload.user);
      setProfile(payload.profile);
      return payload.user;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, logout, signup, refreshUser, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
