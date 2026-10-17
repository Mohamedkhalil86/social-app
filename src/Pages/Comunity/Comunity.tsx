import { useEffect, useState, useRef } from "react";
import Post from "../../Components/Homefeed/Post";
import type { IPost } from "../../Components/Homefeed/Homefeed.interface";
import Creatpost from "../../Components/Creatpost/Creatpost";
import { getallPosts } from "./Comunity.service";

export default function Comunity() {
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (currentPage: number) => {
    try {
      if (currentPage === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }

     
      const data = await getallPosts(currentPage);
      const postsList = data?.posts || data?.data?.posts || data || [];

      if (postsList.length === 0) {
        setHasMore(false);
      } else {
        setUserPosts((prev) => {
          
          const existingIds = new Set(prev.map((p) => p._id || p.id));
          const uniqueNewPosts = postsList.filter(
            (p: IPost) => !existingIds.has(p._id || p.id)
          );
          return [...prev, ...uniqueNewPosts];
        });
      }
    } catch (error) {
      console.error("Failed to load user posts:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

 
  useEffect(() => {
    const currentObserver = observerRef.current;
    if (!currentObserver) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading && !isFetchingMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "200px", 
      threshold: 0.1,
    });

    observer.observe(currentObserver);

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasMore, isLoading, isFetchingMore]);

  return (
    <>
      <Creatpost />

      <div className="min-h-screen w-full py-4">
        <div className="w-full max-w-none space-y-4">
          {isLoading && page === 1 ? (
            <div className="w-full rounded-xl p-8 text-center border border-slate-200 shadow-xs bg-white">
              <p className="text-sm font-semibold text-slate-500">Loading your posts...</p>
            </div>
          ) : userPosts.length > 0 ? (
            <>
              {userPosts.map((post) => (
                <div key={post._id || post.id} className="w-full">
                  <Post
                    prop={post}
                    onPostDeleted={(deletedId) => {
                      setUserPosts((prev) =>
                        prev.filter((p) => (p._id || p.id) !== deletedId)
                      );
                    }}
                  />
                </div>
              ))}

             
              {isFetchingMore && (
                <div className="w-full py-4 text-center text-sm font-semibold text-slate-500 bg-white rounded-xl border border-slate-200">
                  Loading more posts...
                </div>
              )}

             
              {!hasMore && (
                <div className="w-full py-4 text-center text-sm font-medium text-slate-400">
                  You've reached the end of the posts.
                </div>
              )}
            </>
          ) : (
            <div className="w-full bg-white rounded-xl p-8 text-center border border-slate-200 shadow-xs">
              <p className="text-slate-500 font-medium">No posts</p>
            </div>
          )}

        
          <div ref={observerRef} style={{ height: "20px" }} />
        </div>
      </div>
    </>
  );
}