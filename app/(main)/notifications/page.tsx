'use client';

import { useEffect, useState } from 'react';
import { Bell, CalendarClock, Check, FileClock, Inbox, Siren, TrendingUp } from 'lucide-react';

import { notificationsApi } from '@/lib/api';
import { Notification } from '@/lib/types';
import { DateUtils } from '@/lib/utils/date';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    try {
      setError('');
      setNotifications(await notificationsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    }
  };

  useEffect(() => {
    let ignore = false;

    const bootstrap = async () => {
      try {
        const nextNotifications = await notificationsApi.list();
        if (!ignore) {
          setError('');
          setNotifications(nextNotifications);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load notifications');
        }
      }
    };

    void bootstrap();

    return () => {
      ignore = true;
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      await loadNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  };

  const filtered = notifications.filter((notification) => (filter === 'unread' ? !notification.read : true));

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline-reminder':
        return <FileClock className="h-5 w-5 text-accent" />;
      case 'session-reminder':
        return <CalendarClock className="h-5 w-5 text-primary" />;
      case 'overdue-alert':
        return <Siren className="h-5 w-5 text-destructive" />;
      case 'weekly-summary':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      <section className="page-band">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Notifications</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Stay close to the signals that actually need action.</h1>
          <p className="text-sm leading-7 text-muted-foreground">
            Review deadline reminders, session alerts, and summary messages without losing context.
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className="rounded-md">
            All ({notifications.length})
          </Button>
          <Button variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')} className="rounded-md">
            Unread ({notifications.filter((notification) => !notification.read).length})
          </Button>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="border-border/70 bg-card shadow-sm">
            <CardContent className="py-14">
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <Inbox className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Nothing is waiting here.</h3>
                  <p className="text-sm text-muted-foreground">You&apos;re caught up on the current notification stream.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          filtered.map((notification) => (
            <Card key={notification.id} className={`border-border/70 shadow-sm ${!notification.read ? 'bg-secondary/35' : 'bg-card'}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border/70 bg-card">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{DateUtils.formatDateTime(new Date(notification.createdAt))}</p>
                      </div>
                      <Badge variant={notification.read ? 'secondary' : 'outline'} className="w-fit rounded-md">
                        {notification.channel}
                      </Badge>
                    </div>
                  </div>

                  {!notification.read ? (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="rounded-md border border-border/70 p-2 transition hover:bg-card"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4 text-primary" />
                    </button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
