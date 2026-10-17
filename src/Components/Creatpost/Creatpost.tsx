import { useContext, useState } from "react";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { createPost } from "../Creatpost/Creatpost.service";
import toast from "react-hot-toast";
import type { IPost } from "../Homefeed/Homefeed.interface";

interface CreatpostProps {
  onPostCreated?: (newPost: IPost) => void;
}

const frequentlyUsed = ["👍", "😀", "😘", "😍", "😆", "😜", "😅", "😂"];

const smileysList = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
  "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩",
  "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪",
  "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨",
  "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
  "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕",
  "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯"
];

export default function Creatpost({ onPostCreated }: CreatpostProps) {
  const { userData } = useContext(UserAuthContext);
  console.log(userData?._id)
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState("public");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() && !image && !selectedEmoji) return;

    let finalBody = body;
    if (selectedEmoji) {
      finalBody = body ? `${body} ${selectedEmoji}` : selectedEmoji;
    }

    const formData = new FormData();
    formData.append("body", finalBody);
    formData.append("privacy", privacy); 
    if (image) {
      formData.append("image", image);
    }

    try {
      setIsLoading(true);
      const response = await createPost(formData);
      toast.success("Post created successfully!");

      const createdPost = response?.data?.post || response?.post || response?.data;

      
      const newPost = {
        ...createdPost,
        user: {
          ...(typeof createdPost?.user === "object" && createdPost?.user !== null ? createdPost.user : {}),
          name: userData?.name || createdPost?.user?.name,
          photo: userData?.photo || createdPost?.user?.photo,
          username: userData?.username || createdPost?.user?.username,
        }
      };

      if (onPostCreated && newPost) {
        onPostCreated(newPost);
      }

      setBody("");
      setImage(null);
      setSelectedEmoji(null);
      setPrivacy("public");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit} className="rounded-2xl w-full border border-slate-200 bg-white p-4 shadow-sm">
        
        <div className="mb-3 flex items-start gap-3">
          <img 
            alt={userData?.name}
            className="h-11 w-11 rounded-full object-cover" 
            src={userData?.photo} 
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-base font-extrabold text-slate-900">{userData?.name}</p>
              {selectedEmoji && <span className="text-xl">{selectedEmoji}</span>}
            </div>
            
            <div className="mt-1 w-fit flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-earth" aria-hidden="true">
                <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
                <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
                <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
                <circle cx={12} cy={12} r={10} />
              </svg>
              <select 
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="bg-transparent  outline-none cursor-pointer"
              >
                <option value="public">Public</option>
                <option value="following">Followers</option>
                <option value="only_me">Only me</option>
              </select>
            </div>
          </div>
        </div>

        <div className="relative">
          <textarea 
            rows={4} 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`What's on your mind, ${userData?.name}?`}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white" 
          />
        </div>
        
        {image && (
          <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-700">
            <span>Attached: {image.name}</span>
            <button type="button" onClick={() => setImage(null)} className="font-bold text-red-500 hover:underline">Remove</button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <div className="relative flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image text-emerald-600" aria-hidden="true">
                <rect width={18} height={18} x={3} y={3} rx={2} ry={2} />
                <circle cx={9} cy={9} r={2} />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="hidden sm:inline">Photo/video</span>
              <input 
                accept="image/*" 
                className="hidden" 
                type="file" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                  }
                }}
              />
            </label>
            
            <div className="relative">
              <button 
                type="button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile text-amber-500" aria-hidden="true">
                  <circle cx={12} cy={12} r={10} />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1={9} x2="9.01" y1={9} y2={9} />
                  <line x1={15} x2="15.01" y1={9} y2={9} />
                </svg>
                <span className="hidden sm:inline">Feeling/activity</span>
              </button>

              {showEmojiPicker && (
                <div className="absolute left-0 bottom-full mb-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50">
                  <div className="relative mb-3 flex items-center">
                    <svg className="absolute left-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <input 
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full bg-slate-100 py-2 pl-9 pr-4 text-sm outline-none text-slate-700 focus:bg-slate-200 transition"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto pr-1 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-2">Frequently used</p>
                      <div className="flex items-center justify-between gap-1">
                        {frequentlyUsed.map((emoji, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedEmoji(emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-2xl p-1.5 hover:bg-slate-100 rounded-xl transition"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-2">Smileys & People</p>
                      <div className="grid grid-cols-8 gap-1">
                        {smileysList.map((emoji, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedEmoji(emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-2xl p-1.5 hover:bg-slate-100 rounded-xl transition text-center"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
          
          <div className="flex items-center gap-3">
            <button 
              type="submit"
              disabled={(!body.trim() && !image && !selectedEmoji) || isLoading}
              className="flex items-center gap-2 rounded-lg bg-[#1877f2] px-5 py-2 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#166fe5] disabled:opacity-60"
            >
              {isLoading ? "Posting..." : "Post"}
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send" aria-hidden="true">
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                <path d="m21.854 2.147-10.94 10.939" />
              </svg>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}