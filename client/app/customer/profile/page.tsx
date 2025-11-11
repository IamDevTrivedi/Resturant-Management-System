"use client";

import { useEffect, useState } from "react";
import { backend } from "@/config/backend";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/Toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import Image from "next/image";

export default function CustomerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cityName: "",
    role: "",
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await backend.get("/api/v1/user/profile");
        if (res.data.success) {
          setUser(res.data.user);
          setForm(res.data.user);
        }
      } catch {
        Toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Save updated profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await backend.patch("/api/v1/user/update", {
        firstName: form.firstName,
        lastName: form.lastName,
        cityName: form.cityName,
      });

      if (res.data.success) {
        setUser(res.data.user);
        Toast.success("Profile updated successfully!");
        setEditMode(false);
      }
    } catch (err) {
      const error = err as AxiosError;
      Toast.error(error.response?.data?.message || "Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-3xl w-full p-6 space-y-6">
          <Skeleton className="h-8 w-48 mx-auto" />
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 p-6 text-center space-y-4 shadow-lg border">
          <div className="flex flex-col items-center">
            <Image
              src="/placeholder.svg"
              alt="Profile Avatar"
              width={100}
              height={100}
              className="rounded-full border shadow-sm"
            />
            <h2 className="text-xl font-semibold mt-3">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.email || "user@example.com"}
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-2">
  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setEditMode(true)}>
    Edit Profile
  </Button>
  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
    View Rewards
  </Button>
  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
    View Comments
  </Button>
  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Reservation History
  </Button>
</div>

        </Card>

        {/* Details Section */}
        <Card className="md:col-span-2 p-6 shadow-lg border">
          <h1 className="text-2xl font-semibold mb-4">Profile Details</h1>

          {!editMode ? (
            <div className="space-y-4 text-sm sm:text-base">
              <div>
                <p className="text-muted-foreground">First Name</p>
                <p className="font-medium">{user?.firstName || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Name</p>
                <p className="font-medium">{user?.lastName || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">City</p>
                <p className="font-medium">{user?.cityName || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{user?.role || "—"}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  placeholder="First Name"
                />
                <Input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                />
              </div>
              <Input
                disabled
                value={form.email}
                placeholder="Email"
                className="bg-muted"
              />
              <Input
                value={form.cityName}
                onChange={(e) =>
                  setForm({ ...form, cityName: e.target.value })
                }
                placeholder="City Name"
              />

              <div className="flex gap-3 mt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
