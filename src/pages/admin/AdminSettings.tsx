import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    cod_enabled: false,
    free_shipping_threshold: 199,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*');

    if (data) {
      const settingsMap: any = {};
      data.forEach((setting) => {
        if (setting.key === 'cod_enabled') {
          settingsMap.cod_enabled = setting.value === 'true' || setting.value === true;
        } else if (setting.key === 'free_shipping_threshold') {
          settingsMap.free_shipping_threshold = Number(setting.value) || 199;
        }
      });
      setSettings(s => ({ ...s, ...settingsMap }));
    }
    setLoading(false);
  };

  const saveSetting = async (key: string, value: any) => {
    setSaving(true);

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value: String(value) }, { onConflict: 'key' });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Setting saved' });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Store configuration</p>
      </div>

      <div className="space-y-6 max-w-md">
        {/* COD Setting */}
        <div className="admin-card space-y-4">
          <div>
            <h3 className="font-semibold">Payment Options</h3>
            <p className="text-sm text-muted-foreground">Configure payment methods</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Cash on Delivery (COD)</Label>
              <p className="text-sm text-muted-foreground">Allow customers to pay on delivery</p>
            </div>
            <Switch
              checked={settings.cod_enabled}
              onCheckedChange={(checked) => {
                setSettings(s => ({ ...s, cod_enabled: checked }));
                saveSetting('cod_enabled', checked);
              }}
            />
          </div>
        </div>

        {/* Free Shipping Threshold */}
        <div className="admin-card space-y-4">
          <div>
            <h3 className="font-semibold">Shipping</h3>
            <p className="text-sm text-muted-foreground">Configure shipping options</p>
          </div>
          
          <div>
            <Label htmlFor="threshold">Free Shipping Threshold (₹)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="threshold"
                type="number"
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings(s => ({ ...s, free_shipping_threshold: Number(e.target.value) }))}
              />
              <Button 
                onClick={() => saveSetting('free_shipping_threshold', settings.free_shipping_threshold)}
                disabled={saving}
              >
                Save
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Orders above this amount get free shipping
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
