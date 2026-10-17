import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { getSuggestedFriends, toggleFollowUser } from "./Sugfrinds.service";

interface IFriend {
  _id: string;
  name: string;
  username: string;
  photo: string;
  mutualFollowersCount: number;
  followersCount: number;
}

export default function AllSuggestions() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({});

  const fetchAllSuggestions = async (currentPage: number) => {
    try {
      setLoading(true);
      const data = await getSuggestedFriends(20, currentPage);
      const suggestionsList = data?.data?.suggestions || [];

      if (suggestionsList.length === 0) {
        setHasMore(false);
      } else {
        setFriends((prev) => {
          const existingIds = new Set(prev.map((f) => f._id));
          const uniqueNew = suggestionsList.filter((f: IFriend) => !existingIds.has(f._id));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (error) {
      console.error("Failed to load all suggestions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSuggestions(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAllSuggestions(nextPage);
  };

  const handleFollow = async (userId: string) => {
    try {
      setLoadingIds((prev) => ({ ...prev, [userId]: true }));
      await toggleFollowUser(userId);
      setFriends((prev) => prev.filter((friend) => friend._id !== userId));
    } catch (error) {
      console.error("Failed to follow user", error);
    } finally {
      setLoadingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen  py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
          Back to feed
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              <h2 className="font-bold text-slate-900 text-base">All Suggested Friends</h2>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              {friends.length}
            </span>
          </div>

          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 pl-10 pr-4 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-slate-300 transition-all"
                >
                  <NavLink to={`/Userpro/${friend._id}`}>
<div className="flex items-center gap-3 min-w-0">
                    <img
                      src={friend.photo}
                      alt={friend.name}
                      className="h-12 w-12 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{friend.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mb-1">@{friend.username}</p>
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {friend.followersCount} followers
                      </span>
                    </div>
                  </div>

                  </NavLink>

                  <button
                    onClick={() => handleFollow(friend._id)}
                    disabled={loadingIds[friend._id]}
                    className="flex items-center gap-1 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" x2="19" y1="8" y2="14"></line>
                      <line x1="22" x2="16" y1="11" y2="11"></line>
                    </svg>
                    {loadingIds[friend._id] ? "Following..." : "Follow"}
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-xs text-slate-400 py-4">No suggestions available</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {loading ? "Loading more..." : "Load more suggestions"}
              </button>
            ) : (
              <p className="text-xs text-slate-400">You have viewed all suggested friends.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}