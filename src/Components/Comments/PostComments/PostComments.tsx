import { useEffect, useState, useRef } from "react";
import {
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getCommentReplies,
  createReply,
} from "./Comments.service";

interface PostCommentsProps {
  postId: string;
  onClose: () => void;
  onCommentAdded?: (comment: any) => void;
  onCommentUpdated?: (commentId: string, newContent: string) => void;
  onCommentDeleted?: (commentId: string) => void;
  onCommentLiked?: (commentId: string) => void;
}

export default function PostComments({
  postId,
  onClose,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
  onCommentLiked,
}: PostCommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [commentImage, setCommentImage] = useState<File | null>(null);

  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState<File | null>(null);
  
  const [repliesMap, setRepliesMap] = useState<{ [key: string]: any[] }>({});
  const [replyCountsMap, setReplyCountsMap] = useState<{ [key: string]: number }>({});

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState("");

  // States الخاصة بنافذة تأكيد الحذف (للتعليقات والردود)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "comment" | "reply"; commentId: string; replyId?: string } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const commentFileRef = useRef<HTMLInputElement>(null);
  const replyFileRef = useRef<HTMLInputElement>(null);

  function formatTime(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function processReplies(repliesList: any[]) {
    const savedReplyLikes = JSON.parse(localStorage.getItem("reply_likes") || "{}");
    const savedReplyCounts = JSON.parse(localStorage.getItem("reply_counts") || "{}");

    return repliesList.map((r: any) => {
      const replyId = r?._id || r?.id;
      return {
        ...r,
        isLiked: savedReplyLikes[replyId] ?? r.isLiked ?? false,
        likesCount: savedReplyCounts[replyId] !== undefined ? savedReplyCounts[replyId] : (r.likesCount ?? 0),
      };
    });
  }

  async function fetchComments() {
    try {
      const data = await getPostComments(postId);
      const fetchedComments = data?.data?.comments || data?.comments || [];
      
      const savedCommentLikes = JSON.parse(localStorage.getItem("comment_likes") || "{}");
      const savedCommentCounts = JSON.parse(localStorage.getItem("comment_counts") || "{}");

      const processedComments = fetchedComments.map((c: any) => {
        const commentId = c?._id || c?.id;
        return {
          ...c,
          isLiked: savedCommentLikes[commentId] ?? c.isLiked ?? false,
          likesCount: savedCommentCounts[commentId] !== undefined ? savedCommentCounts[commentId] : (c.likesCount ?? 0),
        };
      });

      setComments(processedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newCommentText.trim() && !commentImage) return;
    try {
      const response = await createComment(postId, newCommentText, commentImage || undefined);
      
      const createdComment = response?.data?.comment || response?.comment || response?.data;
      if (onCommentAdded && createdComment) {
        onCommentAdded(createdComment);
      }
      
      setNewCommentText("");
      setCommentImage(null);
      fetchComments();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  }

  async function handleUpdateComment(commentId: string) {
    if (!editCommentText.trim()) return;
    try {
      await updateComment(postId, commentId, editCommentText);
      
      if (onCommentUpdated) {
        onCommentUpdated(commentId, editCommentText);
      }

      setEditingCommentId(null);
      setEditCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  }

  // دوال تنفيذ الحذف بعد التأكيد من الـ Modal
  async function confirmDelete() {
    if (!deleteTarget) return;

    if (deleteTarget.type === "comment") {
      try {
        await deleteComment(postId, deleteTarget.commentId);
        setComments((prev) => prev.filter((c) => (c._id || c.id) !== deleteTarget.commentId));

        if (onCommentDeleted) {
          onCommentDeleted(deleteTarget.commentId);
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    } else if (deleteTarget.type === "reply" && deleteTarget.replyId) {
      try {
        await deleteComment(postId, deleteTarget.replyId);
        setRepliesMap((prev) => {
          const updated = (prev[deleteTarget.commentId] || []).filter((r) => (r._id || r.id) !== deleteTarget.replyId);
          setReplyCountsMap((counts) => ({ ...counts, [deleteTarget.commentId]: updated.length }));
          return { ...prev, [deleteTarget.commentId]: updated };
        });
      } catch (error) {
        console.error("Error deleting reply:", error);
      }
    }

    setDeleteTarget(null);
  }

  async function handleToggleCommentLike(commentId: string) {
    try {
      const response = await toggleCommentLike(postId, commentId);
      const resData = response?.data || response;

      const serverLiked = resData?.liked !== undefined ? resData.liked : undefined;
      const serverCount = resData?.likesCount !== undefined ? resData.likesCount : undefined;

      const savedCommentLikes = JSON.parse(localStorage.getItem("comment_likes") || "{}");
      const savedCommentCounts = JSON.parse(localStorage.getItem("comment_counts") || "{}");

      setComments((prev) =>
        prev.map((c) => {
          const cId = c?._id || c?.id;
          if (cId === commentId) {
            const isLiked = c.isLiked || false;
            const newLiked = serverLiked !== undefined ? serverLiked : !isLiked;
            const newCount = serverCount !== undefined ? serverCount : (newLiked ? (c.likesCount || 0) + 1 : Math.max(0, (c.likesCount || 0) - 1));

            savedCommentLikes[commentId] = newLiked;
            savedCommentCounts[commentId] = newCount;

            localStorage.setItem("comment_likes", JSON.stringify(savedCommentLikes));
            localStorage.setItem("comment_counts", JSON.stringify(savedCommentCounts));

            return {
              ...c,
              isLiked: newLiked,
              likesCount: newCount,
            };
          }
          return c;
        })
      );

      if (onCommentLiked) {
        onCommentLiked(commentId);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  }

  async function toggleReplies(commentId: string) {
    if (activeReplyCommentId === commentId) {
      setActiveReplyCommentId(null);
      return;
    }
    setActiveReplyCommentId(commentId);
    try {
      const data = await getCommentReplies(postId, commentId);
      const rawReplies = data?.data?.replies || data?.replies || [];
      const repliesList = processReplies(rawReplies);
      
      setRepliesMap((prev) => ({ ...prev, [commentId]: repliesList }));
      setReplyCountsMap((prev) => ({ ...prev, [commentId]: repliesList.length }));
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  }

  async function handleAddReply(commentId: string) {
    if (!replyText.trim() && !replyImage) return;
    try {
      await createReply(postId, commentId, replyText, replyImage || undefined);
      setReplyText("");
      setReplyImage(null);
      const data = await getCommentReplies(postId, commentId);
      const rawReplies = data?.data?.replies || data?.replies || [];
      const repliesList = processReplies(rawReplies);

      setRepliesMap((prev) => ({ ...prev, [commentId]: repliesList }));
      setReplyCountsMap((prev) => ({ ...prev, [commentId]: repliesList.length }));
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  }

  async function handleUpdateReply(commentId: string, replyId: string) {
    if (!editReplyText.trim()) return;
    try {
      await updateComment(postId, replyId, editReplyText);
      setEditingReplyId(null);
      setEditReplyText("");
      const data = await getCommentReplies(postId, commentId);
      const rawReplies = data?.data?.replies || data?.replies || [];
      const repliesList = processReplies(rawReplies);

      setRepliesMap((prev) => ({ ...prev, [commentId]: repliesList }));
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  }

  async function handleToggleReplyLike(commentId: string, replyId: string) {
    try {
      const response = await toggleCommentLike(postId, replyId);
      const resData = response?.data || response;

      const serverLiked = resData?.liked !== undefined ? resData.liked : undefined;
      const serverCount = resData?.likesCount !== undefined ? resData.likesCount : undefined;

      const savedReplyLikes = JSON.parse(localStorage.getItem("reply_likes") || "{}");
      const savedReplyCounts = JSON.parse(localStorage.getItem("reply_counts") || "{}");

      setRepliesMap((prev) => {
        const currentReplies = prev[commentId] || [];
        const updated = currentReplies.map((r) => {
          const rId = r?._id || r?.id;
          if (rId === replyId) {
            const isLiked = r.isLiked || false;
            const newLiked = serverLiked !== undefined ? serverLiked : !isLiked;
            const newCount = serverCount !== undefined ? serverCount : (newLiked ? (r.likesCount || 0) + 1 : Math.max(0, (r.likesCount || 0) - 1));

            savedReplyLikes[replyId] = newLiked;
            savedReplyCounts[replyId] = newCount;

            localStorage.setItem("reply_likes", JSON.stringify(savedReplyLikes));
            localStorage.setItem("reply_counts", JSON.stringify(savedReplyCounts));

            return {
              ...r,
              isLiked: newLiked,
              likesCount: newCount,
            };
          }
          return r;
        });
        return { ...prev, [commentId]: updated };
      });
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Comments</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {comments.length}
            </span>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading comments...</div>
          ) : comments.length > 0 ? (
            comments.map((comment) => {
              const commentId = comment._id || comment.id;
              const repliesCount = replyCountsMap[commentId] ?? comment.repliesCount ?? 0;
              const isRepliesOpen = activeReplyCommentId === commentId;

              return (
                <div key={commentId} className="space-y-2">
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <img
                      src={comment.commentCreator?.photo || comment.user?.photo || ""}
                      alt="avatar"
                      className="h-9 w-9 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 text-sm">
                      <div className="flex items-center justify-between" dir="auto">
                        <span className="font-bold text-slate-900">
                          {comment.commentCreator?.name || comment.user?.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{formatTime(comment.createdAt)}</span>
                      </div>

                      {editingCommentId === commentId ? (
                        <div className="mt-1 space-y-2">
                          <input
                            type="text"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="w-full rounded border border-slate-300 px-2 py-1 text-sm bg-white focus:outline-none"
                            dir="auto"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateComment(commentId)} className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white font-semibold">Save</button>
                            <button onClick={() => setEditingCommentId(null)} className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-700 font-semibold">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1" dir="auto">
                          {comment.content && <p className="text-slate-700 text-left rtl:text-right">{comment.content}</p>}
                          {comment.image && (
                            <img src={comment.image} alt="comment attachment" className="mt-2 max-h-40 rounded-lg object-cover" />
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-semibold">
                        <button onClick={() => handleToggleCommentLike(commentId)} className={`hover:text-blue-600 ${comment.isLiked ? "text-blue-600" : ""}`}>
                          Like ({comment.likesCount || 0})
                        </button>
                        <button onClick={() => toggleReplies(commentId)} className="hover:text-blue-600">
                          {isRepliesOpen ? "Hide replies" : `Replies (${repliesCount})`}
                        </button>
                        <button onClick={() => { setEditingCommentId(commentId); setEditCommentText(comment.content || ""); }} className="hover:underline">Edit</button>
                        {/* فتح نافذة التأكيد لحذف الكومنت */}
                        <button onClick={() => setDeleteTarget({ type: "comment", commentId })} className="text-rose-500 hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>

                  {isRepliesOpen && (
                    <div className="ml-8 space-y-3 border-l-2 border-slate-200 pl-4">
                      {repliesMap[commentId]?.map((reply: any) => {
                        const replyId = reply._id || reply.id;
                        return (
                          <div key={replyId} className="flex items-start gap-2 text-xs bg-slate-100 p-2 rounded-lg">
                            <img src={reply.commentCreator?.photo || reply.user?.photo || ""} alt="avatar" className="h-6 w-6 rounded-full object-cover shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between" dir="auto">
                                <span className="font-bold text-slate-800">{reply.commentCreator?.name || reply.user?.name}</span>
                                <span className="text-[9px] text-slate-400">{formatTime(reply.createdAt)}</span>
                              </div>

                              {editingReplyId === replyId ? (
                                <div className="mt-1 space-y-1">
                                  <input
                                    type="text"
                                    value={editReplyText}
                                    onChange={(e) => setEditReplyText(e.target.value)}
                                    className="w-full rounded border border-slate-300 px-2 py-0.5 text-xs bg-white focus:outline-none"
                                    dir="auto"
                                  />
                                  <div className="flex gap-1">
                                    <button onClick={() => handleUpdateReply(commentId, replyId)} className="rounded bg-blue-600 px-2 py-0.5 text-[10px] text-white">Save</button>
                                    <button onClick={() => setEditingReplyId(null)} className="rounded bg-slate-200 px-2 py-0.5 text-[10px]">Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-0.5" dir="auto">
                                  {reply.content && <p className="text-slate-600 text-left rtl:text-right">{reply.content}</p>}
                                  {reply.image && (
                                    <img src={reply.image} alt="reply attachment" className="mt-1 max-h-30 rounded-lg object-cover" />
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-3 mt-1 font-semibold text-slate-500 text-[10px]">
                                <button onClick={() => handleToggleReplyLike(commentId, replyId)} className={`hover:text-blue-600 ${reply.isLiked ? "text-blue-600" : ""}`}>
                                  Like ({reply.likesCount || 0})
                                </button>
                                <button onClick={() => { setEditingReplyId(replyId); setEditReplyText(reply.content || ""); }} className="hover:underline">Edit</button>
                                {/* فتح نافذة التأكيد لحذف الرد */}
                                <button onClick={() => setDeleteTarget({ type: "reply", commentId, replyId })} className="text-rose-500 hover:underline">Delete</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="space-y-2 mt-2">
                        {replyImage && (
                          <div className="relative inline-block">
                            <img src={URL.createObjectURL(replyImage)} alt="preview" className="h-16 w-16 rounded object-cover border" />
                            <button onClick={() => setReplyImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 w-4 text-[10px]">✕</button>
                          </div>
                        )}
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-1 text-xs focus:outline-none focus:border-blue-500 bg-white"
                            dir="auto"
                          />
                          <input type="file" ref={replyFileRef} onChange={(e) => e.target.files && setReplyImage(e.target.files[0])} className="hidden" accept="image/*" />
                          <button type="button" onClick={() => replyFileRef.current?.click()} className="text-slate-500 hover:text-blue-600 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image text-emerald-600" aria-hidden="true"><rect width={18} height={18} x={3} y={3} rx={2} ry={2} /><circle cx={9} cy={9} r={2} /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                          </button>
                          <button onClick={() => handleAddReply(commentId)} className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal" aria-hidden="true"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" /><path d="M6 12h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-base font-medium">No comments yet</p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-3 bg-white rounded-b-2xl space-y-2">
          {commentImage && (
            <div className="relative inline-block">
              <img src={URL.createObjectURL(commentImage)} alt="preview" className="h-16 w-16 rounded object-cover border" />
              <button onClick={() => setCommentImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 w-4 text-[10px]">✕</button>
            </div>
          )}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
              dir="auto"
            />
            <input type="file" ref={commentFileRef} onChange={(e) => e.target.files && setCommentImage(e.target.files[0])} className="hidden" accept="image/*" />
            <button type="button" onClick={() => commentFileRef.current?.click()} className="text-slate-500 hover:text-blue-600 text-lg px-1">
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image text-emerald-600" aria-hidden="true"><rect width={18} height={18} x={3} y={3} rx={2} ry={2} /><circle cx={9} cy={9} r={2} /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
            </button>
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal" aria-hidden="true"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" /><path d="M6 12h16" /></svg>
            </button>
          </form>
        </div>

      </div>

      {/* نافذة تأكيد الحذف المشتركة (للتعليقات والردود) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Confirm action</h3>
              <button 
                onClick={() => setDeleteTarget(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition"
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
                <h4 className="text-base font-bold text-slate-900">
                  {deleteTarget.type === "comment" ? "Delete this comment?" : "Delete this reply?"}
                </h4>
                <p className="text-sm text-slate-500">
                  {deleteTarget.type === "comment" 
                    ? "This comment will be permanently removed." 
                    : "This reply will be permanently removed."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700 shadow-sm transition"
              >
                {deleteTarget.type === "comment" ? "Delete comment" : "Delete reply"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}