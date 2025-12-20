import { getSession } from "~/auth/server";
import {
  ChartAreaInteractive,
  DataTable,
  SectionCards,
} from "~/components/dashboard";
import { SiteHeader } from "~/components/layout";
import data from "./data.json";

export default async function Page() {
  const session = await getSession();
  const useSiteHeader = !!session?.user;
  return (
    <>
      {useSiteHeader && <SiteHeader />}
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
