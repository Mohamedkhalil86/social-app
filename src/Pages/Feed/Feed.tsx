import Display from "../../Components/Display/Display";
import Sidemenu from "../../Components/Sidemenu/Sidemenu";
import Sugfrinds from "../../Components/Sugfrinds/Sugfrinds";
import { useDocumentTitle } from "../../Context/Costumhook/useDocumentTitle";

export default function Feed() {
  useDocumentTitle("Home Feed");

  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      <main className="min-w-0">
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          
         
          <aside className="order-1 xl:order-0 h-fit xl:sticky xl:top-21">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <Sidemenu />
            </div>
          </aside>

         
          <aside className="order-2 xl:hidden h-fit">
            <Sugfrinds />
          </aside>

         
          <section className="order-3 xl:order-0 space-y-4 min-w-0">
            <div className="space-y-4">
              <Display />
            </div>
          </section>

          
          <aside className="hidden xl:block order-0 h-fit xl:sticky xl:top-21">
            <Sugfrinds />
          </aside>

        </div>
      </main>
    </div>
  );
}