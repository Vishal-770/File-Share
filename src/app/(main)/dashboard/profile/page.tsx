"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FetchUser } from "@/services/service";
import Image from "next/image";
import { Users, HardDrive, Upload, FileText } from "lucide-react";

interface FileTypeData {
  type: string;
  count: number;
  size: number;
  color: string;
}

interface ProfileData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    max_storage_size: number;
    current_storage_size: number;
    max_file_upload_size: number;
    teams: string[];
  };
  fileStats: {
    totalFiles: number;
    filesByType: FileTypeData[];
  };
}

const COLORS = {
  Documents: "#8884d8",
  Images: "#82ca9d", 
  Videos: "#ffc658",
  Archives: "#ff7c7c",
  Audio: "#8dd1e1",
  Others: "#d084d0"
};

const Profile = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => FetchUser(user!.id),
    enabled: isLoaded && isSignedIn,
  });

  const {
    data: profileData,
    isLoading: isProfileLoading,
  } = useQuery<ProfileData>({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/profile?id=${user?.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      return response.json();
    },
    enabled: isLoaded && isSignedIn && !!user?.id,
  });

  if (isLoading || isProfileLoading || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Image src="/loading.gif" alt="loading" height={50} width={50} />
      </div>
    );
  }

  if (error || !userData?.user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-destructive">Error loading profile data</p>
      </div>
    );
  }

  const { user: userDetails } = userData;
  const usagePercent = Math.min(
    (userDetails.current_storage_size / userDetails.max_storage_size) * 100,
    100
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const pieData = profileData?.fileStats?.filesByType?.map(item => ({
    name: item.type,
    value: item.size,
    count: item.count,
    color: COLORS[item.type as keyof typeof COLORS] || COLORS.Others
  })) || [];

  const barData = profileData?.fileStats?.filesByType?.map(item => ({
    type: item.type,
    size: Number((item.size / (1024 * 1024)).toFixed(2)), // Convert to MB
    count: item.count
  })) || [];

  return (
    <div className="h-full w-full p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Welcome back, {userDetails.first_name} {userDetails.last_name}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profileData?.fileStats?.totalFiles || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Files uploaded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userDetails.teams?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Teams joined
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatBytes(userDetails.current_storage_size)}
              </div>
              <p className="text-xs text-muted-foreground">
                of {formatBytes(userDetails.max_storage_size)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload Limit</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatBytes(userDetails.max_file_upload_size)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per file limit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatBytes(userDetails.current_storage_size)} of {formatBytes(userDetails.max_storage_size)} used</span>
                <span>{usagePercent.toFixed(1)}%</span>
              </div>
              <Progress value={usagePercent} className="w-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Storage by File Type</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatBytes(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No files uploaded yet
                  </div>
                )}
              </div>

              {/* Bar Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">File Count by Type</h3>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="File Count" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No files uploaded yet
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Type Breakdown */}
        {profileData?.fileStats?.filesByType && profileData.fileStats.filesByType.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>File Type Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.fileStats.filesByType.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[item.type as keyof typeof COLORS] || COLORS.Others }}
                      />
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-muted-foreground">{item.count} files</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatBytes(item.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;