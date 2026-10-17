import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getUserProfileApi, toggleFollowUserApi, getUserPostsApi } from "./Userpro.service";
import type { IUserData } from "./Userpro.interface";
import Post from "../Homefeed/Post"; 

export default function Userpro() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<IUserData | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProfileData() {
      if (!userId) return;
      try {
        setLoading(true);
        
        
        const [profileRes, postsRes] = await Promise.all([
          getUserProfileApi(userId),
          getUserPostsApi(userId).catch(() => [])
        ]);

        if (profileRes?.data) {
          setUser(profileRes.data.user);
          setIsFollowing(profileRes.data.isFollowing);
        }

       
        if (Array.isArray(postsRes)) {
          setUserPosts(postsRes);
        } else if (postsRes?.data?.posts) {
          setUserPosts(postsRes.data.posts);
        } else if (postsRes?.posts) {
          setUserPosts(postsRes.posts);
        } else if (postsRes?.data) {
          setUserPosts(postsRes.data);
        }

      } catch (error) {
        console.error("Failed to load user profile or posts", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!userId || isActionLoading) return;
    try {
      setIsActionLoading(true);
      await toggleFollowUserApi(userId);

      const nextFollowState = !isFollowing;
      setIsFollowing(nextFollowState);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          followersCount: nextFollowState
            ? prevUser.followersCount + 1
            : Math.max(0, prevUser.followersCount - 1),
        };
      });
    } catch (error) {
      console.error("Failed to toggle follow", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-bold text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-3 sm:px-5 pt-2">
      <main className="min-w-0">
        <div className="space-y-4">
          
      
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
              aria-hidden="true"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back
          </button>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div 
              className="h-40 bg-cover bg-center bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)]"
              style={user?.cover ? { backgroundImage: `url(${user.cover})` } : {}}
            ></div>

            <div className="relative -mt-14 px-3 pb-5 sm:px-5">
              <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-white/70 bg-white/95 p-4">
                
                <div className="flex items-end gap-3">
                  <img
                    alt={user?.name}
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm sm:h-24 sm:w-24"
                    src={user?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
                  />
                  <div>
                    <p className="text-xl font-black text-slate-900 sm:text-2xl">
                      {user?.name}
                    </p>
                    <p className="text-sm font-semibold text-slate-500 sm:text-base">
                      @{user?.username}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs sm:text-sm font-bold text-slate-600">
                      <span>{user?.followersCount} <span className="text-slate-400 font-normal">Followers</span></span>
                      <span>·</span>
                      <span>{user?.followingCount} <span className="text-slate-400 font-normal">Following</span></span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={isActionLoading}
                  className={`inline-flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-extrabold transition sm:w-auto disabled:opacity-50 ${
                    isFollowing 
                      ? "bg-slate-200 text-slate-800 hover:bg-slate-300" 
                      : "bg-[#1877f2] text-white hover:bg-[#166fe5]"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user-plus"
                    aria-hidden="true"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" x2="19" y1="8" y2="14" />
                    <line x1="22" x2="16" y1="11" y2="11" />
                  </svg>
                  {isActionLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
                </button>

              </div>
            </div>
          </section>

          
          <section className="space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <Post key={post._id || post.id} prop={post} />
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 font-medium">
                No posts found for this user.
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}