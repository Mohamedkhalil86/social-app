export default function Post() {
  return (
    <div className="space-y-4 w-full">
      <article className="overflow-visible rounded-xl border border-slate-200 shadow-sm bg-white">
        
        {/* الجزء العلوي (محاذاة للشمال بالكامل) */}
        <div className="p-4 text-left dir-ltr">
          <div className="flex items-center gap-3">
            <a className="shrink-0" href="#/profile" data-discover="true">
              <img 
                alt="Mohamed khalil" 
                className="h-11 w-11 rounded-full object-cover" 
                src="https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png" 
              />
            </a>
            
            <div className="min-w-0 flex-1 text-left">
              <a className="truncate text-sm font-bold text-slate-900 hover:underline block text-left" href="#/profile" data-discover="true">
                Mohamed khalil
              </a>
              
              <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500 mt-0.5 justify-start">
                <span>@khalilmode</span>
                <span>·</span>
                <span>12m</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock" aria-hidden="true">
                    <rect width={18} height={11} x={3} y={11} rx={2} ry={2} />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Only me
                  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="relative">
              <button className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis" aria-hidden="true">
                  <circle cx={12} cy={12} r={1} />
                  <circle cx={19} cy={12} r={1} />
                  <circle cx={5} cy={12} r={1} />
                </svg>
              </button>
            </div>
          </div>

          {/* نص البوست والإيموجي جهة الشمال */}
          <div className="mt-3 text-left">
            <p className="flex items-center gap-1.5 text-sm leading-relaxed text-slate-800 justify-start">
              <span>wow</span>
              <span className="text-base">😀</span>
            </p>
          </div>
        </div>

        {/* صورة البوست */}
        <div className="max-h-155 overflow-hidden border-y border-slate-200">
          <button type="button" className="group relative block w-full cursor-zoom-in">
            <img alt="post" className="w-full object-cover" src="https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linked-posts/1791806195776-0a759559-febf-4c3e-9396-e858fd3e6c6f-Gemini_Generated_Image_i113fyi113fyi113.webp" />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </button>
        </div>

        {/* إحصائيات التفاعل */}
        <div className="px-4 pb-2 pt-3 text-sm text-slate-500 dir-ltr">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up" aria-hidden="true">
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                  <path d="M7 10v12" />
                </svg>
              </span>
              <button type="button" className="font-semibold transition cursor-default">0 likes</button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
              <span className="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-repeat2 lucide-repeat-2" aria-hidden="true">
                  <path d="m2 9 3-3 3 3" />
                  <path d="M13 18H7a2 2 0 0 1-2-2V6" />
                  <path d="m22 15-3 3-3-3" />
                  <path d="M11 6h6a2 2 0 0 1 2 2v10" />
                </svg>
                0 shares
              </span>
              <span>0 comments</span>
              <button className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]">View details</button>
            </div>
          </div>
        </div>

        <div className="mx-4 border-t border-slate-200" />

        {/* أزرار التفاعل */}
        <div className="grid grid-cols-3 gap-1 p-1">
          <button className="cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-slate-600 hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up" aria-hidden="true">
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
              <path d="M7 10v12" />
            </svg>
            <span>Like</span>
          </button>
          
          <button className="cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-slate-600 hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle" aria-hidden="true">
              <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
            </svg>
            <span>Comment</span>
          </button>
          
          <button className="cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-slate-600 hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2 lucide-share-2" aria-hidden="true">
              <circle cx={18} cy={5} r={3} />
              <circle cx={6} cy={12} r={3} />
              <circle cx={18} cy={19} r={3} />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
            <span>Share</span>
          </button>
        </div>

      </article>
    </div>
  );
}