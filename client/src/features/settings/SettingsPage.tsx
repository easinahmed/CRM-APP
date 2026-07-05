import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/providers/ThemeProvider';
import { getInitials } from '@/lib/utils';
import { User, Shield, Bell, Palette, Building2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || '');

  const handleSave = () => {
    updateUser({ name, phone, department });
    toast.success('Profile updated');
  };

  return (
    <div>
      <Header title="Settings" />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" /> Profile</TabsTrigger>
              <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-2" /> Appearance</TabsTrigger>
              <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" /> Notifications</TabsTrigger>
              <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" /> Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-lg">{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><label className="text-sm font-medium">Full Name</label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input value={email} onChange={(e) => setEmail(e.target.value)} disabled /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Phone</label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Department</label><Input value={department} onChange={(e) => setDepartment(e.target.value)} /></div>
                  </div>
                  <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium">Theme</p><p className="text-sm text-muted-foreground">Toggle dark mode</p></div>
                    <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={toggleTheme}>
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Push Notifications', desc: 'Receive notifications in-app' },
                    { label: 'Email Notifications', desc: 'Receive email updates' },
                    { label: 'Task Reminders', desc: 'Get reminded about upcoming tasks' },
                    { label: 'Meeting Alerts', desc: 'Get notified about meetings' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div><p className="font-medium text-sm">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                      <label className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-muted cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-5 peer-checked:bg-primary" />
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader><CardTitle>Security</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><label className="text-sm font-medium">Current Password</label><Input type="password" placeholder="Enter current password" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">New Password</label><Input type="password" placeholder="Enter new password" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Confirm Password</label><Input type="password" placeholder="Confirm new password" /></div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
