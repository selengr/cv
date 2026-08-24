"use client";

import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { removeLoginToken, clearPhoneVerifyTokenStorage } from "@/helpers/auth";
import { useAppDispatch } from "@/hooks";
import { updatePhoneVerifyToken, updateUser } from "@/store/auth";

export default function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate } = useSWRConfig();

  return async (redirectTo = "/auth/login") => {
    await removeLoginToken();
    clearPhoneVerifyTokenStorage();
    dispatch(updateUser(undefined));
    dispatch(updatePhoneVerifyToken(undefined));
    await mutate("user_me", null, { revalidate: false });
    router.replace(redirectTo);
  };
}
