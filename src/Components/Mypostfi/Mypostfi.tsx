import { useContext, useEffect, useState } from "react";
import { getUserPostsApi } from "../../Pages/Myposts/Myposts.services"; 
import Post from "../../Components/Homefeed/Post";
import type { IPost } from "../../Components/Homefeed/Homefeed.interface";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import Creatpost from "../../Components/Creatpost/Creatpost";
 

export default function MyPostsPage() {
 const {userData}=useContext(UserAuthContext)
  const userId = userData?._id

  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMyPosts() {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUserPostsApi(userId);
        const postsList = data?.posts || data?.data?.posts || data || [];
        setUserPosts(postsList);
      } catch (error) {
        console.error("Failed to load user posts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyPosts();
  }, [userId]); 

  return (



   <>


    <div className="min-h-screen w-full py-4 ">
  <div className="w-full max-w-none space-y-4">

    {isLoading ? (
      <div className="w-full rounded-xl p-8 text-center border border-slate-200 shadow-xs bg-white">
        <p className="text-sm font-semibold text-slate-500">Loading your posts...</p>
      </div>
    ) : userPosts.length > 0 ? (
      userPosts.map((post) => (
        <div key={post._id || post.id} className="w-full">
          <Post 
            prop={post} 
            onPostDeleted={(deletedId) => {
              setUserPosts((prev) => prev.filter((p) => (p._id || p.id) !== deletedId));
            }}
          />
        </div>
      ))
    ) : (
      <div className="w-full bg-white rounded-xl p-8 text-center border border-slate-200 shadow-xs">
        <p className="text-slate-500 font-medium">You haven't posted anything yet.</p>
      </div>
    )}

  </div>
</div></>
  );
}