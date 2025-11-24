"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "@/components/icons/registry";
import { Can } from "@/components/rbac/can";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Stack } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { cn } from "@/lib/utils";

// Mock user data
const MOCK_USER = {
  full_name: "Elena Rodriguez",
  email: "elena.rodriguez@company.com",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
  bio: "Product designer passionate about creating beautiful and functional user experiences.",
  role: "owner",
  tenant_name: "Acme Corporation",
  tenant_logo: null,
};

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [language, setLanguage] = useState("en");
  const [fontSize, setFontSize] = useState([16]);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // UI-only action handlers
  const handleSave = (section: string) => {
    toast.success("This is a UI example", {
      description: `${section} changes are not yet implemented. This is a visual demonstration.`,
    });
  };

  const handleUploadAvatar = () => {
    toast.info("This is a UI example", {
      description: "Avatar upload is not yet implemented.",
    });
  };

  const handleDeleteAccount = () => {
    toast.error("This is a UI example", {
      description: "Account deletion is not yet implemented.",
    });
  };

  return (
    <Container size="xl" className="py-8">
      <Stack direction="vertical" gap="lg">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-base text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <Icons.user className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Icons.settings className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Icons.palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <Can permission={PERMISSIONS.SETTINGS_UPDATE}>
              <TabsTrigger value="team" className="gap-2">
                <Icons.users className="h-4 w-4" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
            </Can>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and public profile details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-start gap-6">
                  <Avatar className="h-20 w-20 border-2 border-border/50">
                    <AvatarImage
                      src={MOCK_USER.avatar_url}
                      alt={MOCK_USER.full_name}
                    />
                    <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-lg font-semibold text-primary">
                      ER
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">Profile Picture</h3>
                      <Badge variant="soft" className="text-xs">
                        {MOCK_USER.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload a new avatar to personalize your profile. JPG, PNG
                      or GIF (max. 2MB).
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleUploadAvatar}
                      >
                        <Icons.upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                      <Button size="sm" variant="ghost">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Full Name */}
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    defaultValue={MOCK_USER.full_name}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={MOCK_USER.email}
                    placeholder="your.email@company.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is your primary email for notifications and account
                    recovery.
                  </p>
                </div>

                {/* Bio */}
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue={MOCK_USER.bio}
                    placeholder="Tell us a little about yourself..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description for your profile. Max 160 characters.
                  </p>
                </div>

                <Separator />

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("Profile")}>
                    <Icons.check className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            {/* Security Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your password and authentication settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Password */}
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>

                {/* New Password */}
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters with a mix of letters
                    and numbers.
                  </p>
                </div>

                <Separator />

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("Security")}>
                    <Icons.shield className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications and updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your account activity
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Separator />

                  {/* Security Alerts */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about important security events
                      </p>
                    </div>
                    <Switch
                      checked={securityAlerts}
                      onCheckedChange={setSecurityAlerts}
                    />
                  </div>

                  <Separator />

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and tips
                      </p>
                    </div>
                    <Switch
                      checked={marketingEmails}
                      onCheckedChange={setMarketingEmails}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("Notifications")}>
                    <Icons.bell className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions that will affect your account
                  permanently.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-background p-4">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Delete Account</Label>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Icons.trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your interface.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Theme Selection */}
                <div className="space-y-4">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <RadioGroup
                    value={theme}
                    onValueChange={(value) =>
                      setTheme(value as "light" | "dark" | "system")
                    }
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {/* Light Theme */}
                      <div>
                        <RadioGroupItem
                          value="light"
                          id="theme-light"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="theme-light"
                          className={cn(
                            "flex flex-col items-center justify-between rounded-lg border-2 border-border bg-background p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                            "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          )}
                        >
                          <Icons.sun className="mb-3 h-6 w-6" />
                          <div className="text-center">
                            <div className="font-medium">Light</div>
                            <div className="text-xs text-muted-foreground">
                              Bright & clean
                            </div>
                          </div>
                        </Label>
                      </div>

                      {/* Dark Theme */}
                      <div>
                        <RadioGroupItem
                          value="dark"
                          id="theme-dark"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="theme-dark"
                          className={cn(
                            "flex flex-col items-center justify-between rounded-lg border-2 border-border bg-background p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                            "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          )}
                        >
                          <Icons.moon className="mb-3 h-6 w-6" />
                          <div className="text-center">
                            <div className="font-medium">Dark</div>
                            <div className="text-xs text-muted-foreground">
                              Easy on eyes
                            </div>
                          </div>
                        </Label>
                      </div>

                      {/* System Theme */}
                      <div>
                        <RadioGroupItem
                          value="system"
                          id="theme-system"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="theme-system"
                          className={cn(
                            "flex flex-col items-center justify-between rounded-lg border-2 border-border bg-background p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                            "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          )}
                        >
                          <Icons.laptop className="mb-3 h-6 w-6" />
                          <div className="text-center">
                            <div className="font-medium">System</div>
                            <div className="text-xs text-muted-foreground">
                              Auto-detect
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Language Selection */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred language
                    </p>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="w-full sm:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <div className="flex items-center gap-2">
                          <span>🇺🇸</span>
                          <span>English</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="es">
                        <div className="flex items-center gap-2">
                          <span>🇪🇸</span>
                          <span>Español</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="fr">
                        <div className="flex items-center gap-2">
                          <span>🇫🇷</span>
                          <span>Français</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="de">
                        <div className="flex items-center gap-2">
                          <span>🇩🇪</span>
                          <span>Deutsch</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ja">
                        <div className="flex items-center gap-2">
                          <span>🇯🇵</span>
                          <span>日本語</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="zh">
                        <div className="flex items-center gap-2">
                          <span>🇨🇳</span>
                          <span>中文</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Font Size */}
                <div className="space-y-4">
                  <div>
                    <Label>Font Size</Label>
                    <p className="text-sm text-muted-foreground">
                      Adjust the base font size for better readability
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      min={12}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Small (12px)</span>
                      <span className="font-medium text-foreground">
                        {fontSize[0]}px
                      </span>
                      <span>Large (20px)</span>
                    </div>
                  </div>
                  <div
                    className="rounded-lg border border-border bg-muted/30 p-4"
                    style={{ fontSize: `${fontSize[0]}px` }}
                  >
                    <p className="text-foreground">
                      The quick brown fox jumps over the lazy dog. This is how
                      your text will appear with the selected font size.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("Appearance")}>
                    <Icons.palette className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <Can permission={PERMISSIONS.SETTINGS_UPDATE}>
            <TabsContent value="team" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Organization Settings</CardTitle>
                  <CardDescription>
                    Manage your organization's profile and workspace settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Organization Logo */}
                  <div className="flex items-start gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                      {MOCK_USER.tenant_logo ? (
                        <Image
                          src={MOCK_USER.tenant_logo}
                          alt={MOCK_USER.tenant_name}
                          width={80}
                          height={80}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <Icons.building className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-sm font-medium">Organization Logo</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your organization's logo. Recommended size:
                        400x400px.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleUploadAvatar}
                        >
                          <Icons.upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Organization Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      defaultValue={MOCK_USER.tenant_name}
                      placeholder="Enter organization name"
                    />
                  </div>

                  {/* Organization URL */}
                  <div className="grid gap-2">
                    <Label htmlFor="org-url">Workspace URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="org-url"
                        defaultValue="acme"
                        className="flex-1"
                        placeholder="workspace-name"
                      />
                      <div className="flex items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">
                        .yourapp.com
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This will be your organization's unique URL.
                    </p>
                  </div>

                  <Separator />

                  {/* Member Limits */}
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Team Members</Label>
                        <p className="text-sm text-muted-foreground">
                          You're using 10 of 50 available seats
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Icons.users className="mr-2 h-4 w-4" />
                        Manage Plan
                      </Button>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[20%] bg-primary transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => handleSave("Organization")}>
                      <Icons.building className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Section (Read-only) */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Professional Plan</span>
                        <Badge variant="soft-success">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        $99/month • Renews on December 1, 2024
                      </p>
                    </div>
                    <Button variant="outline">
                      <Icons.creditCard className="mr-2 h-4 w-4" />
                      Manage Billing
                    </Button>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/10 p-4">
                    <div className="flex items-start gap-3">
                      <Icons.info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Need more features?
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Upgrade to Enterprise for advanced security, SSO, and
                          dedicated support.
                        </p>
                        <Button variant="link" className="h-auto p-0 text-sm">
                          Learn more about Enterprise →
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Can>
        </Tabs>
      </Stack>
    </Container>
  );
}
