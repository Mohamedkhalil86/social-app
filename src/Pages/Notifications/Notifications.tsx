import { useEffect, useState, useContext, useRef } from "react";
import {
  getAllNotificationsApi,
  getUnreadNotificationsApi,
  getUnreadNotificationsCountApi,
  markAllNotificationsAsReadApi,
} from "./Notification.service";
import NotificationItem from "../../Components/NotificationItem/NotificationItem";
import type { INotification } from "./Notification.interface";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { useDocumentTitle } from "../../Context/Costumhook/useDocumentTitle";

export default function Notifications() {
  const { userData } = useContext(UserAuthContext);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [markingAll, setMarkingAll] = useState<boolean>(false);
  
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pageRef = useRef<number>(1);
  const filterRef = useRef<"all" | "unread">(filter);
useDocumentTitle("Notifications");
  pageRef.current = page;
  filterRef.current = filter;

  const fetchNotificationsData = async (filterType: "all" | "unread", pageNum: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const notifRes = filterType === "all" 
        ? await getAllNotificationsApi(pageNum, 10) 
        : await getUnreadNotificationsApi(pageNum, 10);

      if (!isLoadMore) {
        const countRes = await getUnreadNotificationsCountApi().catch(() => ({ unreadCount: 0 }));
        if (countRes?.unreadCount !== undefined) {
          setUnreadCount(countRes.unreadCount);
        } else if (countRes?.data?.unreadCount !== undefined) {
          setUnreadCount(countRes.data.unreadCount);
        }
      }

      const list = notifRes?.data?.notifications || notifRes?.notifications || [];
      const pagination = notifRes?.meta?.pagination || notifRes?.pagination;

      if (Array.isArray(list)) {
        setNotifications((prev) => (isLoadMore ? [...prev, ...list] : list));
        
        if (pagination) {
          setHasMore(pageNum < pagination.numberOfPages);
        } else {
          setHasMore(list.length === 10);
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchNotificationsData(filter, 1, false);
  }, [filter]);

  // مراقبة التمرير لتحميل الصفحة التالية تلقائياً عند الوصول لنهاية الصفحة
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
        !loading &&
        !loadingMore &&
        hasMore
      ) {
        const nextPage = pageRef.current + 1;
        setPage(nextPage);
        fetchNotificationsData(filterRef.current, nextPage, true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadingMore, hasMore]);

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await markAllNotificationsAsReadApi();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="w-[90%] max-w-none mx-auto py-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="text-left space-y-1">
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400">
              Realtime updates for likes, comments, shares, and follows.
            </p>
          </div>

          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAll || notifications.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {markingAll ? "Updating..." : "Mark all as read"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Unread
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400">
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map((item) => (
                <NotificationItem
                  key={item._id}
                  notification={item}
                  currentUserId={userData?._id}
                  onReadStateChange={() => fetchNotificationsData(filter, 1, false)}
                />
              ))}
              {loadingMore && (
                <div className="py-4 text-center text-xs font-bold text-slate-400">
                  Loading more notifications...
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-xs font-semibold text-slate-400">
              No notifications found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}