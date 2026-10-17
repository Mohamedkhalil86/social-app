import { useState, useEffect, type ChangeEvent, useContext } from "react";
import { getUserProfile, uploadProfilePhoto } from "./profilepage.service";
import type { IUser } from "./Profilepage.interface";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { getSavedPosts } from "../Mysaved/Mysave.service";
import { getUserPostsApi } from "../../Pages/Myposts/Myposts.services";
import { NavLink, Outlet, useLocation } from "react-router";
import { useDocumentTitle } from "../../Context/Costumhook/useDocumentTitle";

export default function Profilepage() {
useDocumentTitle("Profile");

  const [userDataa, setUserData] = useState<IUser | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedPostsCount, setSavedPostsCount] = useState<number>(0);
  const [myPostsCount, setMyPostsCount] = useState<number>(0);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const { userData } = useContext(UserAuthContext);
  const location = useLocation();

  const fetchProfileCounts = async () => {
    try {
      const profileId = userData?._id;
      if (!profileId) return;

      const [profileRes, savedPosts, myPostsRes] = await Promise.all([
        getUserProfile(profileId),
        getSavedPosts().catch(() => []),
        getUserPostsApi(profileId).catch(() => [])
      ]);

      if (profileRes?.data?.user) {
        setUserData(profileRes.data.user);
      }

      if (Array.isArray(savedPosts)) {
        setSavedPostsCount(savedPosts.length);
      } else if (savedPosts?.data) {
        setSavedPostsCount(savedPosts.data.length);
      }

      if (Array.isArray(myPostsRes)) {
        setMyPostsCount(myPostsRes.length);
      } else if (myPostsRes?.data?.posts) {
        setMyPostsCount(myPostsRes.data.posts.length);
      } else if (myPostsRes?.posts) {
        setMyPostsCount(myPostsRes.posts.length);
      } else if (myPostsRes?.data) {
        setMyPostsCount(myPostsRes.data.length);
      }
    } catch (error) {
      console.error("Failed to load profile counts", error);
    }
  };

  const fetchInitialData = async () => {
    setLoading(true);
    await fetchProfileCounts();
    setLoading(false);
  };

  useEffect(() => {
    if (userData?._id) {
      fetchInitialData();
    }
  }, [userData]);

  
  useEffect(() => {
    const handleUpdateCounts = () => {
      fetchProfileCounts();
    };

    window.addEventListener("postChanged", handleUpdateCounts);
    window.addEventListener("savedPostsChanged", handleUpdateCounts);

    return () => {
      window.removeEventListener("postChanged", handleUpdateCounts);
      window.removeEventListener("savedPostsChanged", handleUpdateCounts);
    };
  }, [userData?._id]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploadingPhoto(true);
    setPhotoMessage("Please wait...");
    setIsError(false);

    try {
      await uploadProfilePhoto(file);
      const successMsg = "Profile photo updated successfully";
      setPhotoMessage(successMsg);
      setIsError(false);

      await fetchProfileCounts();
    } catch (error: any) {
      console.error("Failed to update profile photo", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to upload profile photo";
      setPhotoMessage(errorMsg);
      setIsError(true);
    } finally {
      setIsUploadingPhoto(false);
      setTimeout(() => {
        setPhotoMessage(null);
      }, 4000);
    }
  };

  const handleCoverChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const localImageUrl = URL.createObjectURL(file);
    setCoverPhoto(localImageUrl);
  };

  const handleRemoveCover = () => {
    setCoverPhoto(null);
  };

  const isSavedRoute = location.pathname.includes("save");
  const currentBadgeCount = isSavedRoute ? savedPostsCount : myPostsCount;

  if (loading) {
    return <div className="text-center py-20 text-slate-500 font-bold">Loading...</div>;
  }

  return (
    <>
      <div className="w-full max-w-318 mt-4 mx-auto space-y-6 px-4 md:px-4 sm:px-0">
        
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px] w-full">
          <div 
            className="group/cover relative h-44 sm:h-52 lg:h-60 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] bg-cover bg-center"
            style={coverPhoto ? { backgroundImage: `url(${coverPhoto})` } : {}}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]"></div>
            <div className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-white/8 blur-3xl"></div>
            <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-[#c7e6ff]/10 blur-3xl"></div>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent"></div>
            
            <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
              {coverPhoto && (
                <a 
                  href={coverPhoto} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/75 shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-maximize-2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                  View cover
                </a>
              )}

              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/75 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                Change cover
                <input accept="image/*" className="hidden" type="file" onChange={handleCoverChange} />
              </label>

              <button 
                type="button" 
                onClick={handleRemoveCover}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-rose-600 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                Remove
              </button>
            </div>
          </div>

          <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
            <div className="rounded-3xl border border-white/60 bg-white/92 p-5 backdrop-blur-xl sm:p-7">
              
              {photoMessage && (
                <div className={`mb-4 p-3 rounded-xl text-xs font-bold transition-all shadow-sm ${isError ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-blue-50 text-[#1877f2] border border-blue-200'}`}>
                  {photoMessage}
                </div>
              )}

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                
                <div className="min-w-0">
                  <div className="flex items-end gap-4">
                    
                    <div className="group/avatar relative shrink-0">
                      <button 
                        type="button" 
                        onClick={() => userDataa?.photo && setIsPhotoModalOpen(true)}
                        className="cursor-pointer rounded-full relative block"
                      >
                        <img 
                          alt={userDataa?.name} 
                          className={`h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe] transition duration-200 ${isUploadingPhoto ? 'opacity-50' : ''}`} 
                          src={userDataa?.photo} 
                        />
                        {isUploadingPhoto && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                            <span className="text-[10px] font-bold text-white animate-pulse">Loading...</span>
                          </div>
                        )}
                      </button>
                      
                      {userDataa?.photo && (
                        <button 
                          type="button"
                          onClick={() => setIsPhotoModalOpen(true)}
                          title="View photo"
                          className="absolute bottom-1 left-1 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur transition duration-200 hover:bg-black/80 opacity-0 group-hover/avatar:opacity-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-maximize-2">
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                          </svg>
                        </button>
                      )}

                      <label 
                        title="Change photo"
                        className="absolute bottom-1 right-1 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white shadow-md transition duration-200 hover:bg-[#166fe5] opacity-0 group-hover/avatar:opacity-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera">
                          <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"></path>
                          <circle cx="12" cy="13" r="3"></circle>
                        </svg>
                        <input accept="image/*" className="hidden" type="file" onChange={handleImageChange} disabled={isUploadingPhoto} />
                      </label>
                    </div>

                    <div className="min-w-0 pb-1">
                      <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">{userDataa?.name}</h2>
                      <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">@{userDataa?.username}</p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users" aria-hidden="true">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        Route Posts member
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid w-full grid-cols-3 gap-2 lg:w-130">
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">Followers</p>
                    <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{userDataa?.followersCount}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">Following</p>
                    <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{userDataa?.followingCount}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">Bookmarks</p>
                    <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{savedPostsCount}</p>
                  </div>
                </div>

              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-extrabold text-slate-800">About</h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-slate-500" aria-hidden="true">
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      </svg>
                      {userDataa?.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users text-slate-500" aria-hidden="true">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                      Active on Route Posts
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">My posts</p>
                    <p className="mt-1 text-2xl font-black text-slate-900">{myPostsCount}</p>
                  </div>
                  <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">Saved posts</p>
                    <p className="mt-1 text-2xl font-black text-slate-900">{savedPostsCount}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="space-y-4 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
              
              <NavLink 
                to="postfi"
                className={({ isActive }) => 
                  `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition cursor-pointer ${
                    isActive ? "bg-white text-[#1877f2] shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                My Posts
              </NavLink>

              <NavLink 
                to="save"
                className={({ isActive }) => 
                  `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition cursor-pointer ${
                    isActive ? "bg-white text-[#1877f2] shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark">
                  <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"></path>
                </svg>
                Saved
              </NavLink>

            </div>
            <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2]">{currentBadgeCount}</span>
          </div>
        </section>

        <section className="space-y-4 w-full mb-5">
          <Outlet />
        </section>

      </div>

      {isPhotoModalOpen && userDataa?.photo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-all duration-300"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute -top-12 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <img 
              src={userDataa.photo} 
              alt={userDataa.name} 
              className="max-w-[90vw] max-h-[90vh] rounded-2xl object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </>
  );
}