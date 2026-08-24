"use client";

import { useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import callApi from "@/helpers/callApi";
import { useAppDispatch } from "@/hooks";
import { updateUser } from "@/store/auth";
import type { UserType } from "@/models/user";

const fetchCurrentUser = async () => {
  try {
    const res = await callApi().get("/user");
    const payload = res.data;
    if (payload?.user) return payload.user as UserType;
    if (payload?.id && payload?.name) return payload as UserType;
    return null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "user_me",
    fetchCurrentUser,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      dedupingInterval: 4000,
    },
  );

  const user = data ?? undefined;

  useEffect(() => {
    dispatch(updateUser(user));
  }, [dispatch, user]);

  return {
    user,
    error,
    loading: isLoading || (isValidating && data === undefined),
    authenticated: Boolean(user),
    mutate,
  };
};

export default useAuth;
