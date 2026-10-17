import { useState, useEffect } from "react";
import Creatpost from "../../Components/Creatpost/Creatpost";
import { getSavedPosts } from "./Mysave.service";
import type { IPost } from "../../Components/Homefeed/Homefeed.interface";
import Post from "../../Components/Homefeed/Post";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSavedPostsData = async () => {
    try {
      setLoading(true);
      const postsList = await getSavedPosts();
      setSavedPosts(postsList);
    } catch (error) {
      console.error("Error loading saved posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPostsData();
  }, []);

  const handleUnsave = (postId: string) => {
    setSavedPosts((prev) => prev.filter((post) => (post._id || (post as any).id) !== postId));
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500 font-bold">Loading saved posts...</div>;
  }

  return (
    <>
      <Creatpost />
      
      <div className="max-w-full mx-auto mt-4 space-y-4">
        {savedPosts.length > 0 ? (
          savedPosts.map((post) => (
            <Post 
              key={post._id || (post as any).id} 
              prop={post} 
              onUnsave={handleUnsave}
              onPostDeleted={handleUnsave}
            />
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm font-semibold">
            No saved posts found.
          </div>
        )}
      </div>
    </>
  );
}