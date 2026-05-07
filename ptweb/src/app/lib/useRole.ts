"use client";

import { useEffect, useState } from "react";

export type UserRole = "Admin" | "Trainer" | "Student";

export interface RoleInfo {
  role: UserRole | null;
  isAdmin: boolean;
  isTrainer: boolean;
  isStudent: boolean;
  trainerId: string | null;
  isLoading: boolean;
}

export function useRole(): RoleInfo {
  const [roleInfo, setRoleInfo] = useState<RoleInfo>({
    role: null,
    isAdmin: false,
    isTrainer: false,
    isStudent: false,
    trainerId: null,
    isLoading: true,
  });

  useEffect(() => {
    const role = (localStorage.getItem("userRole")) as UserRole | null;
    const trainerId = localStorage.getItem("userId") ?? null;
    setRoleInfo({
      role,
      isAdmin: role === "Admin",
      isTrainer: role === "Trainer",
      isStudent: role === "Student",
      trainerId,
      isLoading: false,
    });
  }, []);

  return roleInfo;
}
