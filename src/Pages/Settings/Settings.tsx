import  { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordFormValues } from "./ChangePassword.schema";
import { changePasswordApi } from "./ChangePassword.service";
import { useDocumentTitle } from "../../Context/Costumhook/useDocumentTitle";

export default function ChangePassword() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
useDocumentTitle("Change Password");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      setIsLoading(true);
      setServerError(null);
      setSuccessMessage(null);

      const response = await changePasswordApi({
        password: data.password,
        newPassword: data.newPassword,
      });

      if (response?.message === "success" || response) {
        setSuccessMessage("Password updated successfully!");
        reset();
      }
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message || "Failed to update password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>
          <div className="space-y-0.5 text-left">
            <h2 className="text-xl font-black text-slate-900">Change Password</h2>
            <p className="text-xs text-slate-400">Keep your account secure by using a strong password.</p>
          </div>
        </div>

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold text-center">
            {successMessage}
          </div>
        )}
        {serverError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 block">Current password</label>
            <input
              type="password"
              placeholder="Enter current password"
              {...register("password")}
              className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none bg-white ${
                errors.password
                  ? "border-rose-300 text-rose-900 placeholder:text-rose-300 focus:border-rose-500"
                  : "border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-[11px] font-semibold text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 block">New password</label>
            <input
              type="password"
              placeholder="Enter new password"
              {...register("newPassword")}
              className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none bg-white ${
                errors.newPassword
                  ? "border-rose-300 text-rose-900 placeholder:text-rose-300 focus:border-rose-500"
                  : "border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500"
              }`}
            />
            {errors.newPassword ? (
              <p className="text-[11px] font-semibold text-rose-600">{errors.newPassword.message}</p>
            ) : (
              <p className="text-[11px] text-slate-400">At least 8 characters with uppercase, lowercase, number, and special character.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 block">Confirm new password</label>
            <input
              type="password"
              placeholder="Re-enter new password"
              {...register("confirmPassword")}
              className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none bg-white ${
                errors.confirmPassword
                  ? "border-rose-300 text-rose-900 placeholder:text-rose-300 focus:border-rose-500"
                  : "border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-[11px] font-semibold text-rose-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 py-3 text-xs font-bold text-white shadow-sm transition cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? "Updating..." : "Update password"}
          </button>

        </form>

      </div>
    </div>
  );
}