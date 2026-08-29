'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ErrorState } from '@/components/shared/error-state';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/hooks/use-api';
import {
  ShieldAlert,
  Bell,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import type { SystemSettings } from '@/lib/types';

export default function SettingsPage() {
  const { data: settings, isLoading, error, refetch } = useSettings();
  const [local, setLocal] = React.useState<SystemSettings | null>(null);

  React.useEffect(() => {
    if (settings) setLocal(settings);
  }, [settings]);

  const update = <K extends keyof SystemSettings>(
    section: K,
    key: keyof SystemSettings[K],
    value: SystemSettings[K][keyof SystemSettings[K]]
  ) => {
    if (!local) return;
    setLocal({
      ...local,
      [section]: { ...local[section], [key]: value },
    });
  };

  if (isLoading || !local) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Configure your marketplace trust and security settings." />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Configure your marketplace trust and security settings." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your marketplace trust and security settings."
        actions={
          <Button onClick={() => toast.success('Settings saved successfully')}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        }
      />

      {/* Fraud Detection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle className="text-base">Fraud Detection</CardTitle>
              <CardDescription>Configure how suspicious activity is detected and flagged.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Detection Sensitivity</Label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => update('fraudDetection', 'sensitivity', level)}
                  className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    local.fraudDetection.sensitivity === level
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Auto-Flag Threshold (Risk Score)</Label>
              <span className="text-sm font-semibold text-primary">{local.fraudDetection.autoFlagThreshold}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[local.fraudDetection.autoFlagThreshold]}
              onValueChange={(v) => update('fraudDetection', 'autoFlagThreshold', v[0])}
            />
            <p className="text-xs text-muted-foreground">Users with a risk score above this threshold will be automatically flagged.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>IP Sharing Alerts</Label>
                <p className="text-xs text-muted-foreground">Alert when multiple accounts share the same IP address.</p>
              </div>
              <Switch
                checked={local.fraudDetection.ipSharingAlerts}
                onCheckedChange={(v) => update('fraudDetection', 'ipSharingAlerts', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Payment Sharing Alerts</Label>
                <p className="text-xs text-muted-foreground">Alert when multiple accounts use the same payment method.</p>
              </div>
              <Switch
                checked={local.fraudDetection.paymentSharingAlerts}
                onCheckedChange={(v) => update('fraudDetection', 'paymentSharingAlerts', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Review Velocity Alerts</Label>
                <p className="text-xs text-muted-foreground">Alert when review frequency spikes abnormally.</p>
              </div>
              <Switch
                checked={local.fraudDetection.reviewVelocityAlerts}
                onCheckedChange={(v) => update('fraudDetection', 'reviewVelocityAlerts', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>Choose how you receive marketplace alerts and updates.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Alerts</Label>
              <p className="text-xs text-muted-foreground">Receive alerts via email.</p>
            </div>
            <Switch checked={local.notifications.emailAlerts} onCheckedChange={(v) => update('notifications', 'emailAlerts', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Slack Integration</Label>
              <p className="text-xs text-muted-foreground">Send alerts to a Slack channel.</p>
            </div>
            <Switch checked={local.notifications.slackIntegration} onCheckedChange={(v) => update('notifications', 'slackIntegration', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Daily Digest</Label>
              <p className="text-xs text-muted-foreground">Receive a daily summary of marketplace activity.</p>
            </div>
            <Switch checked={local.notifications.dailyDigest} onCheckedChange={(v) => update('notifications', 'dailyDigest', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Critical Alerts Only</Label>
              <p className="text-xs text-muted-foreground">Only notify for critical-severity alerts.</p>
            </div>
            <Switch checked={local.notifications.criticalOnly} onCheckedChange={(v) => update('notifications', 'criticalOnly', v)} />
          </div>
        </CardContent>
      </Card>

      {/* Trust */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <div>
              <CardTitle className="text-base">Trust & Verification</CardTitle>
              <CardDescription>Set thresholds for marketplace trust scoring.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Minimum Trust Score</Label>
              <span className="text-sm font-semibold text-primary">{local.trust.minTrustScore}</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[local.trust.minTrustScore]}
              onValueChange={(v) => update('trust', 'minTrustScore', v[0])}
            />
            <p className="text-xs text-muted-foreground">Users below this score will be monitored more closely.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Auto-Suspend Threshold</Label>
              <span className="text-sm font-semibold text-destructive">{local.trust.autoSuspendThreshold}</span>
            </div>
            <Slider
              min={0}
              max={50}
              step={5}
              value={[local.trust.autoSuspendThreshold]}
              onValueChange={(v) => update('trust', 'autoSuspendThreshold', v[0])}
            />
            <p className="text-xs text-muted-foreground">Users below this trust score will be automatically suspended.</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Review Verification</Label>
              <p className="text-xs text-muted-foreground">Require verification before reviews are published.</p>
            </div>
            <Switch
              checked={local.trust.reviewVerification}
              onCheckedChange={(v) => update('trust', 'reviewVerification', v)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
