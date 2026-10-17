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

export default function Sugfrinds() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

 
  useEffect(() => {
    async function fetchInitialSuggestions() {
      try {
        const data = await getSuggestedFriends(5, 1);
        const suggestionsList = data?.data?.suggestions || [];
        setFriends(suggestionsList);
      } catch (error) {
        console.error("Failed to load suggested friends:", error);
      }
    }
    fetchInitialSuggestions();
  }, []);


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
    <div className="w-full space-y-3">
     
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm xl:hidden">
        <div className="flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users text-[#1877f2]" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
          <span className="font-bold text-slate-900 text-sm">Suggested Friends</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
            {friends.length}
          </span>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            {isOpen ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 ${isOpen ? "block" : "hidden xl:block"}`}>
        
      
        <div className="hidden xl:flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users text-[#1877f2]" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            <span className="font-bold text-slate-900 text-sm">Suggested Friends</span>
          </div>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
            {friends.length}
          </span>
        </div>

      
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
          />
        </div>

       
        <div className="space-y-2.5">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5 shadow-xs hover:border-slate-200 transition-all"
              >
                <NavLink to={`/Userpro/${friend._id}`} >
                
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={friend.photo}
                    alt={friend.name}
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{friend.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate mb-1">@{friend.username}</p>
                    <span className="inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                      {friend.followersCount} followers
                    </span>
                  </div>
                </div>
                </NavLink>

               
                <button
                  onClick={() => handleFollow(friend._id)}
                  disabled={loadingIds[friend._id]}
                  className="flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {loadingIds[friend._id] ? "Following..." : "Follow"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-slate-400 py-2">No more suggestions</p>
          )}
        </div>

      
        <button
          onClick={() => navigate("/all-suggestions")}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          View more
        </button>
      </div>
    </div>
  );
}