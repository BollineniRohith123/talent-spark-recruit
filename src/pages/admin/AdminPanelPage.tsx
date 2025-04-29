import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Building2,
  Settings,
  FileText,
  Upload,
  ClipboardCheck,
  FileSearch,
  Calendar,
  PieChart,
  UserPlus,
  Lock,
  Database,
  Workflow,
  Mic,
  CreditCard,
  BarChart3,
  Bell
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const AdminPanelPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleAction = (action: string) => {
    toast({
      title: "Admin Action",
      description: `${action} action initiated`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-2">
          Manage all aspects of the system with unrestricted access
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-background">
            <Shield className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-background">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="organization" className="data-[state=active]:bg-background">
            <Building2 className="h-4 w-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-background">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Admin Quick Actions</CardTitle>
                <CardDescription>
                  Access all administrative functions from one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => handleNavigate("/profiles")}
                  >
                    <UserPlus className="h-8 w-8 mb-2" />
                    <span>Manage Users</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => handleNavigate("/teams")}
                  >
                    <Building2 className="h-8 w-8 mb-2" />
                    <span>Manage Locations</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => handleNavigate("/settings")}
                  >
                    <Settings className="h-8 w-8 mb-2" />
                    <span>System Settings</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => handleNavigate("/dashboard")}
                  >
                    <BarChart3 className="h-8 w-8 mb-2" />
                    <span>View Metrics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate("/profiles")}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Modify User Roles")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Modify User Roles
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Reset User Password")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Reset User Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>
                  Manage company structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate("/teams")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Locations
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate("/teams")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Departments
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Update Company Profile")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Update Company Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate("/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  General Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Manage Integrations")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Manage Integrations
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("View System Logs")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View System Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users, roles, and permissions across the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">User Operations</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleNavigate("/profiles")}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New User
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Bulk Import Users")}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Import Users
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Export User List")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export User List
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Role Management</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleAction("Assign User Roles")}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Assign User Roles
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Create Custom Role")}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Create Custom Role
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Manage Role Permissions")}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Manage Role Permissions
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Security Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Reset User Password")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Reset User Password
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Lock User Account")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Lock User Account
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("View Login History")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Login History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Structure</CardTitle>
              <CardDescription>
                Manage locations, departments, and team structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location Management</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleNavigate("/teams")}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      View All Locations
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Add New Location")}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Add New Location
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Assign Location Manager")}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Location Manager
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Department Management</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleNavigate("/teams")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View All Departments
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Add New Department")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Add New Department
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Assign Department Head")}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Department Head
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Team Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleNavigate("/profiles")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Team Members
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Create Team")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Assign Team Lead")}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Team Lead
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure system-wide settings and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">General Settings</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleNavigate("/settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Configure Email Templates")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Configure Email Templates
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Manage Notifications")}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Manage Notifications
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Integrations</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleAction("Configure SmartMatch Voice Screening")}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Configure SmartMatch Voice Screening
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Configure Workflow Automation")}
                    >
                      <Workflow className="h-4 w-4 mr-2" />
                      Configure Workflow Automation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("API Integrations")}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      API Integrations
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">License & Billing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Manage License")}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Manage License
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Billing Settings")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Usage Reports")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Usage Reports
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanelPage;
