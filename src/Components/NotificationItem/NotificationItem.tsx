import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { markSingleNotificationAsReadApi } from "../../Pages/Notifications/Notification.service";
import type { INotification } from "../../Pages/Notifications/Notification.interface";

interface NotificationItemProps {
  notification: INotification;
  currentUserId?: string;
  onReadStateChange?: () => void;
}

export default function NotificationItem({ notification, currentUserId, onReadStateChange }: NotificationItemProps) {
  const navigate = useNavigate();
  const [isRead, setIsRead] = useState<boolean>(notification.isRead);
  const [loadingRead, setLoadingRead] = useState<boolean>(false);

  const actor = notification.actor;
  const actorId = actor?._id;
  const isMyProfile = currentUserId && actorId && currentUserId === actorId;
  const actorProfileRoute = isMyProfile ? "/profile" : `/Userpro/${actorId}`;

  const handleNotificationClick = async () => {
    if (!isRead) {
      try {
        await markSingleNotificationAsReadApi(notification._id);
        setIsRead(true);
        if (onReadStateChange) onReadStateChange();
      } catch (error) {
        console.error("Failed to mark as read", error);
      }
    }

    if (notification.entityType === "post" && notification.entityId) {
      navigate(`/post/${notification.entityId}`);
    } else if (notification.entityType === "user" && actorId) {
      navigate(actorProfileRoute);
    }
  };

  const handleMarkAsReadOnly = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRead || loadingRead) return;
    try {
      setLoadingRead(true);
      await markSingleNotificationAsReadApi(notification._id);
      setIsRead(true);
      if (onReadStateChange) onReadStateChange();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    } finally {
      setLoadingRead(false);
    }
  };

  const timeAgo = (dateString: string) => {
    if (!dateString) return "";
    const now = new Date();
    const past = new Date(dateString);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const elapsed = now.getTime() - past.getTime();

    if (elapsed < msPerMinute) return `${Math.max(1, Math.round(elapsed / 1000))}s`;
    if (elapsed < msPerHour) return `${Math.round(elapsed / msPerMinute)}m`;
    if (elapsed < msPerDay) return `${Math.round(elapsed / msPerHour)}h`;
    return `${Math.round(elapsed / msPerDay)}d`;
  };

  const renderTypeIcon = () => {
    if (notification.type.includes("like")) {
      return (
        <svg className="w-3.5 h-3.5 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    } else if (notification.type.includes("share")) {
      return (
        <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="17 1 21 5 17 9"></polyline>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
          <polyline points="7 23 3 19 7 15"></polyline>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        </svg>
      );
    } else if (notification.type.includes("comment")) {
      return (
        <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      );
    }
  };

  const getActionText = () => {
    if (notification.type.includes("like")) return "liked your post";
    if (notification.type.includes("share")) return "shared your post";
    if (notification.type.includes("comment")) return "commented on your post";
    if (notification.type.includes("follow")) return "started following you";
    return notification.content || "interacted with you";
  };

  return (
    <div 
      onClick={handleNotificationClick}
      className={`flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer hover:shadow-xs ${
        isRead ? "bg-white border-slate-100 hover:bg-slate-50/60" : "bg-blue-50/40 border-blue-100 hover:bg-blue-50/80"
      }`}
    >
      <div className="flex items-start gap-3.5 min-w-0">
        <NavLink 
          to={actorProfileRoute} 
          onClick={(e) => e.stopPropagation()} 
          className="relative shrink-0"
        >
          <img
            src={actor?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
            alt={actor?.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        </NavLink>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs text-slate-800 text-start" dir="auto">
            <NavLink 
              to={actorProfileRoute} 
              onClick={(e) => e.stopPropagation()} 
              className="font-bold text-slate-900 hover:underline inline-block mr-1"
            >
              {actor?.name}
            </NavLink>
            <span className="text-slate-600 font-medium">{getActionText()}</span>
          </p>

          {notification.entity?.body && (
            <p className="text-xs text-slate-500 text-start line-clamp-1 font-normal" dir="auto">
              {notification.entity.body}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1 text-[11px]">
            {renderTypeIcon()}
            {isRead ? (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Read
              </span>
            ) : (
              <button
                onClick={handleMarkAsReadOnly}
                disabled={loadingRead}
                className="text-blue-600 hover:underline font-bold cursor-pointer disabled:opacity-50"
              >
                {loadingRead ? "Updating..." : "Mark as read"}
              </button>
            )}
          </div>
        </div>
      </div>

      <span className="text-xs font-medium text-slate-400 shrink-0 ml-2">
        {timeAgo(notification.createdAt)}
      </span>
    </div>
  );
}