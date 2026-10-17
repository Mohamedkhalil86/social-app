import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getSinglePostApi } from "../../Components/Postditals/Postditals.services";
import Post from "../../Components/Homefeed/Post";
import type { IPost } from "../../Components/Homefeed/Homefeed.interface";

export default function PostDetailsPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPostDetails() {
      if (!postId) return;
      try {
        const response = await getSinglePostApi(postId);
        const postData = response?.data?.post || response?.post || response?.data;
        setPost(postData);
      } catch (error) {
        console.error("Failed to fetch post details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPostDetails();
  }, [postId]);

  return (
    <div className="w-full max-w-230 mx-auto mt-4 space-y-6 px-4 md:px-4 sm:px-0">
      
      <div className=" w-full   space-y-4">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs transition"
        >
          ← Back
        </button>

        {isLoading ? (
          <div className="w-full bg-white rounded-xl p-8 text-center border border-slate-200 shadow-xs">
            <p className="text-sm font-semibold text-slate-500">Loading post details...</p>
          </div>
        ) : post ? (
          <div className="w-full">
            <Post prop={post} hideDetailsBtn={true} />
          </div>
        ) : (
          <div className="w-full bg-white rounded-xl p-8 text-center border border-slate-200 shadow-xs">
            <p className="text-slate-500 font-medium">Post NotFound........</p>
          </div>
        )}

      </div>
    </div>
  );
}