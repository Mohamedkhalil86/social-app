import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getPostLikesApi } from "../Homefeed/Homefeed.service";
import type { ILikeUser } from "../Homefeed/Homefeed.interface";

interface PostLikesModalProps {
  postId: string;
  currentUserId?: string;
  onClose: () => void;
}

export default function PostLikesModal({ postId, currentUserId, onClose }: PostLikesModalProps) {
  const [likesUsers, setLikesUsers] = useState<ILikeUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLikes() {
      try {
        setLoading(true);
        const res = await getPostLikesApi(postId);
        
        // الوصول الصحيح للمصفوفة بناءً على شكل الـ API الخاص بك
        const users = res?.data?.likes || res?.likes || [];

        setLikesUsers(Array.isArray(users) ? users : []);
      } catch (error) {
        console.error("Failed to load likes users", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLikes();
  }, [postId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Likes</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-8 text-center text-xs font-bold text-slate-400">
              Loading...
            </div>
          ) : likesUsers.length > 0 ? (
            likesUsers.map((user) => {
              const userId = user._id || (user as any).id;
              const isMyProfile = currentUserId && currentUserId === userId;
              const profileRoute = isMyProfile ? "/profile" : `/Userpro/${userId}`;

              return (
                <div key={userId} className="flex items-center justify-between">
                  <NavLink to={profileRoute} onClick={onClose} className="flex items-center gap-3 min-w-0 group">
                    <img
                      src={user.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 text-left">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:underline truncate">
                        {user.name}
                      </h4>
                      {user.username && (
                        <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                      )}
                    </div>
                  </NavLink>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No likes yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}