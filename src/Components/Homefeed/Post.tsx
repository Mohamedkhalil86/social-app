import { useEffect, useState, useRef, useContext } from "react";
import type { IPost } from "./Homefeed.interface";
import { NavLink, useNavigate } from "react-router";
import { toggleLikeApi, deletePostApi, updatePostApi } from "./Homefeed.service";
import { sharePostApi } from "./Homefeed.service";
import { getPostComments } from "../Comments/PostComments/Comments.service";
import PostComments from "../Comments/PostComments/PostComments";
import PostLikesModal from "../PostLikesModal/PostLikesModal";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import axios from "axios";

interface PostProps {
  prop: IPost;
  onPostDeleted?: (postId: string) => void;
  onUnsave?: (postId: string) => void;
  hideDetailsBtn?: boolean;
}

export default function Post({ prop, onPostDeleted, onUnsave, hideDetailsBtn = false }: PostProps) {
  const navigate = useNavigate();
  const { userData } = useContext(UserAuthContext);
  
  const postId = prop?._id || prop?.id || (prop as any)?.post?._id;
  const postUserId = prop?.user?._id || (prop as any)?.user?.id;
  
  const currentUserId = userData?._id;
  const isMyProfile = currentUserId && postUserId && currentUserId === postUserId;
  const profileRoute = isMyProfile ? "/profile" : `/Userpro/${postUserId}`;

  const sharedPost = (prop as any)?.sharedPost;

  const [likesCount, setLikesCount] = useState<number>(prop?.likesCount ?? 0);
  const [commentsCount, setCommentsCount] = useState<number>(prop?.commentsCount ?? 0);
  const [sharesCount, setSharesCount] = useState<number>(prop?.sharesCount ?? 0);
  
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    const savedLikes = JSON.parse(localStorage.getItem("user_likes") || "{}");
    return savedLikes[postId] ?? (prop as any)?.isLiked ?? false;
  });

  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    return (prop as any)?.bookmarked ?? (prop as any)?.isBookmarked ?? true;
  });

  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [showLikesModal, setShowLikesModal] = useState<boolean>(false);
  const [latestComment, setLatestComment] = useState<any>(null);

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editBody, setEditBody] = useState<string>(prop?.body || "");
  const [postBody, setPostBody] = useState<string>(prop?.body || "");
  
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareBody, setShareBody] = useState<string>("");
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const [alertModalMessage, setAlertModalMessage] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null | undefined>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchLatestComment() {
      try {
        const data = await getPostComments(prop._id, 1, 1);
        const comments = data?.data?.comments || data?.comments || [];
        if (comments.length > 0) {
          setLatestComment(comments[0]);
        }
      } catch (error) {
        console.error("Error fetching latest comment:", error);
      }
    }
    fetchLatestComment();
  }, [prop._id]);

  async function handleLike() {
    try {
      const response = await toggleLikeApi(prop._id);
      const resData = response?.data || response;

      const newIsLiked = resData?.liked !== undefined ? resData.liked : !isLiked;
      setIsLiked(newIsLiked);

      if (resData?.likesCount !== undefined) {
        setLikesCount(resData.likesCount);
      } else {
        if (newIsLiked) {
          setLikesCount((prev) => prev + 1);
        } else {
          setLikesCount((prev) => Math.max(0, prev - 1));
        }
      }

      const savedLikes = JSON.parse(localStorage.getItem("user_likes") || "{}");
      savedLikes[postId] = newIsLiked;
      localStorage.setItem("user_likes", JSON.stringify(savedLikes));

    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    }
  }

  async function handleBookmarkToggle() {
    try {
      const token = localStorage.getItem("user_tkn");
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/${postId}/bookmark`,
        {},
        {
          headers: {
            token: `${token}`,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);

      if (!newBookmarkState && onUnsave) {
        onUnsave(postId);
      }
    } catch (error) {
      console.error("Failed to bookmark/unbookmark post:", error);
    }
  }

  async function handleSharePost() {
    try {
      setIsSharing(true);
      await sharePostApi(postId, shareBody);
      setSharesCount((prev) => prev + 1);
      setShowShareModal(false);
      setShareBody("");
    } catch (error: any) {
      console.error("Failed to share post:", error);
      setShowShareModal(false);
      if (error?.response?.status === 409) {
        setAlertModalMessage(error?.response?.data?.message || "You cannot share this post again or share your own post!");
      } else {
        setAlertModalMessage("Failed to share the post. Please try again.");
      }
    } finally {
      setIsSharing(false);
    }
  }

  async function confirmDeletePost() {
    try {
      await deletePostApi(prop._id);
      setShowDeleteModal(false);
      if (onPostDeleted) {
        onPostDeleted(prop._id);
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  }

  async function handleUpdatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!editBody.trim()) return;
    try {
      await updatePostApi(prop._id, editBody);
      setPostBody(editBody);
      setIsEditing(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  }

  function handleNewCommentAdded(newComment: any) {
    setLatestComment(newComment);
    setCommentsCount((prev) => prev + 1);
  }

  function handleCommentUpdated(commentId: string, newContent: string) {
    const topId = latestComment?._id || latestComment?.id;
    if (topId === commentId) {
      setLatestComment((prev: any) => ({ ...prev, content: newContent }));
    }
  }

  function handleCommentDeleted(commentId: string) {
    const topId = latestComment?._id || latestComment?.id;
    if (topId === commentId) {
      setLatestComment(null);
    }
    setCommentsCount((prev) => Math.max(0, prev - 1));
  }

  function handleCommentLiked(commentId: string) {
    const topId = latestComment?._id || latestComment?.id;
    if (topId === commentId) {
      setLatestComment((prev: any) => {
        const isLiked = prev.isLiked || false;
        return {
          ...prev,
          isLiked: !isLiked,
          likesCount: isLiked ? Math.max(0, (prev.likesCount || 0) - 1) : (prev.likesCount || 0) + 1,
        };
      });
    }
  }

  function timeAgo(dateString: string) {
    if (!dateString) return "";
    const now = new Date();
    const past = new Date(dateString);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = now.getTime() - past.getTime();

    if (elapsed < msPerMinute) {
      const seconds = Math.round(elapsed / 1000);
      return seconds <= 1 ? "s" : ` ${seconds} s`;
    } else if (elapsed < msPerHour) {
      const minutes = Math.round(elapsed / msPerMinute);
      return ` ${minutes} m`;
    } else if (elapsed < msPerDay) {
      const hours = Math.round(elapsed / msPerHour);
      return ` ${hours} h`;
    } else if (elapsed < msPerMonth) {
      const days = Math.round(elapsed / msPerMonth);
      return ` ${days} d`;
    } else if (elapsed < msPerYear) {
      const months = Math.round(elapsed / msPerMonth);
      return ` ${months} mm`;
    } else {
      const years = Math.round(elapsed / msPerYear);
      return ` ${years} y`;
    }
  }

  return (
    <div className="space-y-4 w-full relative">
      <article className="overflow-visible rounded-xl border border-slate-200 shadow-sm bg-white">
        
        <div className="p-4 text-left relative">
          <div className="flex items-center gap-3">
            <NavLink to={profileRoute} className="shrink-0">
              <img alt={prop?.user?.name} className="h-11 w-11 rounded-full object-cover" src={prop?.user?.photo || ""} />
            </NavLink>
            <div className="min-w-0 flex-1 text-left">
              <NavLink to={profileRoute} className="truncate text-sm font-bold text-slate-900 hover:underline block">
                {prop?.user?.name}
              </NavLink>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5" dir="auto">
                <span>@{prop?.user?.username}</span>
                <span>· {timeAgo(prop.createdAt)}</span>
                <span>{prop?.privacy}</span>
              </div>
            </div>

            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx={12} cy={12} r={1} />
                  <circle cx={19} cy={12} r={1} />
                  <circle cx={5} cy={12} r={1} />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 z-20 text-xs">
                  <button 
                    onClick={() => { handleBookmarkToggle(); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    {isBookmarked ? (
                      <span className="flex items-center gap-2 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark">
                          <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"></path>
                        </svg>
                        Un save post
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark">
                          <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"></path>
                        </svg>
                        save post
                      </span>
                    )}
                  </button>

                  <button 
                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
                    Edit post
                  </button>
                  
                  <button onClick={() => { setShowDeleteModal(true); setShowMenu(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-left font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2" aria-hidden="true"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    Delete post
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-1 px-4 mb-3" dir="auto">
            <p className="text-sm leading-relaxed text-slate-800 text-start">{postBody}</p>
          </div>
        </div>

        {sharedPost ? (
          <div className="mx-4 mb-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2.5 text-left">
            <div className="flex items-center gap-2.5">
              <NavLink 
                to={currentUserId && sharedPost?.user?._id === currentUserId ? "/profile" : `/Userpro/${sharedPost?.user?._id}`}
                className="shrink-0"
              >
                <img
                  src={sharedPost?.user?.photo || ""}
                  alt={sharedPost?.user?.name}
                  className="h-9 w-9 rounded-full object-cover shrink-0"
                />
              </NavLink>
              <div className="min-w-0 flex-1">
                <NavLink 
                  to={currentUserId && sharedPost?.user?._id === currentUserId ? "/profile" : `/Userpro/${sharedPost?.user?._id}`}
                  className="text-xs font-bold text-slate-900 hover:underline truncate block"
                >
                  {sharedPost?.user?.name}
                </NavLink>
                <p className="text-[11px] text-slate-400 truncate">
                  @{sharedPost?.user?.username}
                </p>
              </div>
            </div>

            {sharedPost?.body && (
              <p className="text-xs leading-relaxed text-slate-700 text-start" dir="auto">
                {sharedPost.body}
              </p>
            )}

            {sharedPost?.image && (
              <div 
                onClick={() => setSelectedImage(sharedPost.image)}
                className="max-h-96 overflow-hidden rounded-xl border border-slate-200 mt-2 cursor-pointer transition hover:opacity-95"
              >
                <img
                  src={sharedPost.image}
                  alt="Shared content"
                  className="w-full object-cover"
                />
              </div>
            )}
          </div>
        ) : (
          prop?.image && (
            <div 
              onClick={() => setSelectedImage(prop.image)}
              className="max-h-155 overflow-hidden border-y border-slate-200 cursor-pointer transition hover:opacity-95"
            >
              <img alt="post" className="w-full object-cover" src={prop.image} />
            </div>
          )
        )}

        <div className="px-4 pb-2 pt-3 text-sm text-slate-500">
          <div className="flex items-center justify-between gap-2">
            <div 
              onClick={() => setShowLikesModal(true)}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-white p-1 shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2,2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                  <path d="M7 10v12" />
                </svg>
              </span>
              <span className="font-medium text-slate-600 text-xs sm:text-sm">{likesCount} likes</span>
            </div>
            
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span>{sharesCount} shares</span>
              <span>{commentsCount} comments</span>
              {!hideDetailsBtn && (
                <button 
                  onClick={() => navigate(`/post/${postId}`)} 
                  className="font-bold text-[#1877f2] hover:underline cursor-pointer"
                >
                  View details
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mx-4 border-t border-slate-200" />

        <div className="grid grid-cols-3 gap-1 p-1">
          <button 
            onClick={handleLike} 
            className={`flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors sm:text-sm cursor-pointer ${
              isLiked ? "text-[#1877f2] bg-blue-50 font-bold" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up">
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
            <span>Like</span>
          </button>
          
          <button onClick={() => setShowCommentsModal(true)} className="flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 sm:text-sm cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>Comment</span>
          </button>
          
          <button 
            onClick={() => setShowShareModal(true)} 
            className="flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 sm:text-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
            <span>Share</span>
          </button>
        </div>

        {latestComment && (
          <div className="p-4">
            <div className="p-4 pt-2 bg-slate-50 border rounded-2xl space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left">
                TOP COMMENT
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white p-3 border border-slate-100">
                <img 
                  src={latestComment.commentCreator?.photo || latestComment.user?.photo || ""} 
                  alt="avatar" 
                  className="h-9 w-9 rounded-full object-cover shrink-0" 
                />
                <div className="flex-1 text-sm">
                  <div className="font-bold text-slate-900 flex">
                    {latestComment.commentCreator?.name || latestComment.user?.name}
                  </div>
                  <div className="mt-0.5" dir="auto">
                    {latestComment.content && <p className="text-slate-700 text-left rtl:text-right">{latestComment.content}</p>}
                  </div>
                </div>
              </div>
              <div className="px-4 flex">
                <button onClick={() => setShowCommentsModal(true)} className="text-sm font-semibold text-[#1877f2] hover:underline cursor-pointer">
                  View all comments
                </button>
              </div>
            </div> 
          </div>
        )}

      </article>

      {/* Image Preview Modal (LightBox with Backdrop Blur) */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-zoom-out"
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <img 
            src={selectedImage} 
            alt="Full size view" 
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 cursor-default"
          />
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Share post</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <textarea
                value={shareBody}
                onChange={(e) => setShareBody(e.target.value)}
                placeholder="Say something about this..."
                dir="auto"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-blue-500 min-h-24 resize-none bg-slate-50/50 text-start"
              />

              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs text-left">
                <div className="flex items-center gap-3">
                  <img 
                    src={prop?.user?.photo || ""} 
                    alt={prop?.user?.name} 
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                  />
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-900">{prop?.user?.name}</h4>
                    <p className="text-[11px] text-slate-400">@{prop?.user?.username}</p>
                  </div>
                </div>

                {prop?.body && (
                  <p className="text-xs text-slate-700 text-start line-clamp-3" dir="auto">
                    {prop.body}
                  </p>
                )}

                {prop?.image && (
                  <div className="h-40 overflow-hidden rounded-xl border border-slate-100">
                    <img src={prop.image} alt="post preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSharePost}
                disabled={isSharing}
                className="px-4 py-2 rounded-xl bg-[#1877f2] text-xs font-bold text-white hover:bg-[#166fe5] shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {isSharing ? "Sharing..." : "Share now"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Custom Alert Modal for Errors / Duplicate Share */}
      {alertModalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Notice</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{alertModalMessage}</p>
              </div>
              <button
                onClick={() => setAlertModalMessage(null)}
                className="w-full py-2.5 rounded-xl bg-[#1877f2] text-xs font-bold text-white hover:bg-[#166fe5] transition cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Confirm action</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-base font-bold text-slate-900">Delete this post?</h4>
                <p className="text-sm text-slate-500">This post will be permanently removed from your profile and feed.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700 shadow-sm transition cursor-pointer"
              >
                Delete post
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">تعديل البوست</h3>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:border-blue-500 min-h-25"
                dir="auto"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
                >
                  Save Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCommentsModal && (
        <PostComments 
          postId={prop._id} 
          onClose={() => setShowCommentsModal(false)} 
          onCommentAdded={handleNewCommentAdded}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
          onCommentLiked={handleCommentLiked}
        />
      )}

      {showLikesModal && (
        <PostLikesModal
          postId={postId}
          currentUserId={currentUserId}
          onClose={() => setShowLikesModal(false)}
        />
      )}
    </div>
  );
}