import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "../sign/sign.zod";
import type { LoginDataType, RegisterDataType } from "../sign/sign.interface";
import { userLogin, userRegister } from "../sign/sign.services";
import toast from "react-hot-toast";
import { useNavigate , Link } from "react-router";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";

export default function Sign() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useNavigate();
  const { setUserData } = useContext(UserAuthContext);

  
  const loginForm = useForm<LoginDataType>({
    defaultValues: { email: "", password: "" },
    mode: "all",
    resolver: zodResolver(loginSchema),
  });

 
  const registerForm = useForm<RegisterDataType>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      password: "",
      rePassword: "",
    },
    mode: "all",
    resolver: zodResolver(registerSchema),
  });

  function handleLogin(data: LoginDataType) {
    toast.promise(userLogin(data), {
      loading: "Please wait.",
      success: (res) => {
        localStorage.setItem("user_tkn", res.data.token);
        setUserData(res.data.user);
        loginForm.reset();
        router("/");
        return <h1 className="text-emerald-500 capitalize">{res.message}</h1>;
      },
      error: (err) => <h1 className="text-red-500 capitalize">{err.response?.data?.message || "حدث خطأ ما"}</h1>,
    });
  }

  function handleRegister(data: RegisterDataType) {
    toast.promise(userRegister(data), {
      loading: "Please wait.",
      success: (res) => {
        setIsLogin(true);
        registerForm.reset();
        return <h1 className="text-emerald-500 capitalize">{res.message} </h1>;
      },
      error: (err) => <h1 className="text-red-500 capitalize">{err.response?.data?.message || "حدث خطأ ما"}</h1>,
    });
  }

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] px-4 py-8 sm:py-12 lg:flex lg:items-center" style={{ fontFamily: "Cairo, sans-serif" }}>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        
        
      <section className="order-2 w-full max-w-xl text-center lg:order-1 lg:text-left">
  <h1 className="hidden text-5xl font-extrabold tracking-tight text-[#00298d] sm:text-6xl lg:block">
    Route Posts
  </h1>
  <p className="hidden mt-4 text-2xl font-medium leading-snug text-slate-800 lg:block">
    Connect with friends and the world around you on Route Posts.
  </p>
  <div className="mt-6 rounded-2xl border border-[#c9d5ff] bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
    <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#00298d]">
      About Route Academy
    </p>
    <p className="mt-1 text-lg font-bold text-slate-900">
      Egypt's Leading IT Training Center Since 2012
    </p>
    <p className="mt-2 text-sm leading-relaxed text-slate-700">
      Route Academy is the premier IT training center in Egypt, established in 2012. We specialize in delivering high-quality training courses in programming, web development, and application development. We've identified the unique challenges people may face when learning new technology and made efforts to provide strategies to overcome them.
    </p>
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
      <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
        <p className="text-base font-extrabold text-[#00298d]">2012</p>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Founded</p>
      </div>
      <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
        <p className="text-base font-extrabold text-[#00298d]">40K+</p>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Graduates</p>
      </div>
      <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
        <p className="text-base font-extrabold text-[#00298d]">50+</p>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Partner Companies</p>
      </div>
      <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
        <p className="text-base font-extrabold text-[#00298d]">5</p>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Branches</p>
      </div>
      <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
        <p className="text-base font-extrabold text-[#00298d]">20</p>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Diplomas Available</p>
      </div>
    </div>
  </div>
</section>


        
        <section className="order-1 w-full max-w-107.5 lg:order-2">
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-xl">
            
            
            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`rounded-lg py-2 text-sm font-extrabold transition ${isLogin ? "bg-white text-[#00298d] shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`rounded-lg py-2 text-sm font-extrabold transition ${!isLogin ? "bg-white text-[#00298d] shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
              >
                Register
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              {isLogin ? "Log in to Route Posts" : "Create a new account"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isLogin ? "Log in and continue your social journey." : "It's quick and easy."}
            </p>

           
            {isLogin ? (
              <form noValidate onSubmit={loginForm.handleSubmit(handleLogin)} className="mt-5 space-y-3.5">
                <div>
                  <input
                    {...loginForm.register("email")}
                    placeholder="Email or username"
                    className="w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                    type="text"
                  />
                  {loginForm.formState.errors.email && (
                    <span className="text-red-500 text-xs mt-1 block">{loginForm.formState.errors.email.message}</span>
                  )}
                </div>

                <div>
                  <input
                    {...loginForm.register("password")}
                    placeholder="Password"
                    className="w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                    type="password"
                  />
                  {loginForm.formState.errors.password && (
                    <span className="text-red-500 text-xs mt-1 block">{loginForm.formState.errors.password.message}</span>
                  )}
                </div>

                <button
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full rounded-xl py-3 text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b]"
                  type="submit"
                >
                  Log In
                </button>

                <div className="text-center w-full"><Link  to="/Forgotpassword">Forgot password?</Link></div>
              </form>
            ) : (
              
              <form noValidate onSubmit={registerForm.handleSubmit(handleRegister)} className="mt-5 space-y-3.5">
                <div>
                  <input
                    {...registerForm.register("name")}
                    placeholder="Full name"
                    className="w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                    type="text"
                  />
                  {registerForm.formState.errors.name && (
                    <span className="text-red-500 text-xs mt-1 block">{registerForm.formState.errors.name.message}</span>
                  )}
                </div>

                <div>
                  <input
                    {...registerForm.register("username")}
                    placeholder="Username (optional)"
                    className="w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                    type="text"
                  />
                </div>

                <div>
                  <input
                    {...registerForm.register("email")}
                    placeholder="Email address"
                    className="w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                    type="email"
                  />
                  {registerForm.formState.errors.email && (
                    <span className="text-red-500 text-xs mt-1 block">{registerForm.formState.errors.email.message}</span>
                  )}
                </div>

                <div>
                  <select
                    {...registerForm.register("gender")}
                    className="w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {registerForm.formState.errors.gender && (
                    <span className="text-red-500 text-xs mt-1 block">{registerForm.formState.errors.gender.message}</span>
                  )}
                </div>

                <div>
                  <input
                    {...registerForm.register("dateOfBirth")}
                    className="w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                    type="date"
                  />
                  {registerForm.formState.errors.dateOfBirth && (
                    <span className="text-red-500 text-xs mt-1 block">{registerForm.formState.errors.dateOfBirth.message}</span>
                  )}
                </div>

                <div>
                  <input
                    {...registerForm.register("password")}
                    placeholder="Password"
                    className="w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                    type="password"
                  />
                  {registerForm.formState.errors.password && (
                    <span className="text-red-500 text-xs mt-1 block">{registerForm.formState.errors.password.message}</span>
                  )}
                </div>

                <div>
                  <input
                    {...registerForm.register("rePassword")}
                    placeholder="Confirm password"
                    className="w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                    type="password"
                  />
                  {registerForm.formState.errors.rePassword && (
                    <span className="text-red-500 text-xs mt-1 block">{registerForm.formState.errors.rePassword.message}</span>
                  )}
                </div>

                <button
                  disabled={registerForm.formState.isSubmitting}
                  className="w-full rounded-xl py-3 text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b]"
                  type="submit"
                >
                  Create New Account
                </button>
              </form>
            )}

          </div>
        </section>

      </div>
    </div>
  );
}