"use client";

import { useEffect } from "react";
import useSWR from "swr";
import callApi from "@/helpers/callApi";
import { useAppDispatch } from "@/hooks";
import { updateUser } from "@/store/auth";
import type { UserType } from "@/models/user";

const fetchCurrentUser = async () => {
  const res = await callApi().get("/user");
  return res.data?.user as UserType | undefined;
};

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useSWR("user_me", fetchCurrentUser);

  useEffect(() => {
    dispatch(updateUser(data));
  }, [data, dispatch]);

  return { user: data, error, loading: isLoading };
};

export default useAuth;
