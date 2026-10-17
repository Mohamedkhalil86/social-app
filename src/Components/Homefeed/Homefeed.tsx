import { useEffect, useState } from "react";
import type { IPost } from "./Homefeed.interface";
import { getFeedPosts } from "./Homefeed.service";
import Post from "./Post";
import Creatpost from "../Creatpost/Creatpost"; 

export default function Homefeed() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await getFeedPosts("following", 10);
        setPosts(response?.data?.posts || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

 
  function handlePostDeleted(deletedId: string) {
    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== deletedId));
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-sm font-semibold text-slate-500">Loading feed...</p>
      </div>
    );
  }

  return (

<>

 <div className="mb-4 ">

<Creatpost  onPostCreated={(newPost) => setPosts([newPost, ...posts])} />

 </div>


    <div className="space-y-4 w-full">
      
     
     

      
      {posts.length > 0 ? (
        posts.map((singlePost, index) => {
          return (
            <Post 
              key={singlePost._id || index} 
              prop={singlePost} 
              onPostDeleted={handlePostDeleted} 
            />
          );
        })
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          No posts found.
        </div>
      )}
    </div>
</>
  );
}