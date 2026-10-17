

import Display from "../../Components/Display/Display";

import Sidemenu from "../../Components/Sidemenu/Sidemenu";
import Sugfrinds from "../../Components/Sugfrinds/Sugfrinds";
import { useDocumentTitle } from "../../Context/Costumhook/useDocumentTitle";
 

export default function Feed() {

  useDocumentTitle("Home Feed");
   
  return (
    <>
    <div className="mx-auto max-w-7xl px-4 py-4">
  <main className="min-w-0">
    <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
      
      
      <aside className="hidden h-fit space-y-3 xl:sticky xl:top-21 xl:block">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <Sidemenu />
        </div>
      </aside>

      
      <section className="space-y-4 min-w-0">
        
        
        <div className="space-y-4">
          <Display />
        </div>
      </section>

      
      <aside className="hidden h-fit xl:sticky xl:top-21 xl:block">
        <Sugfrinds />
      </aside>

    </div>
  </main>
</div>
    
    
    </>
  )
}
