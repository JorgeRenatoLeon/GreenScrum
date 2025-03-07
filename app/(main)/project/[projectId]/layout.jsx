"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { BarLoader } from "react-spinners";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function ProjectLayout({ params, children }) {
  const { projectId } = params;
  const pathname = usePathname();

  // Extract the tab value from the pathname
  const tabValue = pathname.includes("/productbacklog")
    ? "backlog"
    : pathname.includes("/sprints")
    ? "sprints"
    : pathname.includes("/retrospective")
    ? "retrospective"
    : pathname.includes("/review")
    ? "review"
    : "dashboard"; // Default to Dashboard

  // Helper function to check if the tab is active
  const getTabClass = (tabName) => {
    return tabValue === tabName
      ? "bg-[hsl(178.5,52.96%,38.6%)] text-white border-0" // Active tab color
      : "text-[hsl(178.5,52.96%,38.6%)] hover:text-white hover:bg-[hsl(178.5,52.96%,38.6%)] border-0"; // Hover color
  };

  return (
    <div className="mx-auto w-full">
      <Suspense fallback={<BarLoader width={"100%"} color="hsl(178.5deg 52.63% 29.8%) text-yellow"  />}>
        <Tabs value={tabValue} className="w-full mt-5">
          <TabsList className="grid grid-cols-5 w-full bg-white text-[hsl(178.5,52.96%,38.6%)]">
            <TabsTrigger
              value="dashboard"
              asChild
              className={`${getTabClass("dashboard")} flex items-center justify-center border-r border-gray-400 last:border-r-0 rounded-none`}
              data-state={tabValue === "dashboard"}>
              <Link href={`/project/${projectId}`} className="w-full text-center">
                Dashboard
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="backlog"
              asChild
              className={`${getTabClass("backlog")} flex items-center justify-center border-r border-gray-400 last:border-r-0 rounded-none`}
              data-state={tabValue === "backlog"}>
              <Link href={`/project/${projectId}/productbacklog`} className="w-full text-center">
                Product Backlog
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="sprints"
              asChild
              className={`${getTabClass("sprints")} flex items-center justify-center border-r border-gray-400 last:border-r-0 rounded-none`}
              data-state={tabValue === "sprints"}>
              <Link href={`/project/${projectId}/sprints`} className="w-full text-center">
                Sprints
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="retrospective"
              asChild
              className={`${getTabClass("retrospective")} flex items-center justify-center border-r border-gray-400 last:border-r-0 rounded-none`}
              data-state={tabValue === "retrospective"}>
              <Link href={`/project/${projectId}/retrospective`} className="w-full text-center">
                Retrospective
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="review"
              asChild
              className={`${getTabClass("review")} flex items-center justify-center last:border-r-0 rounded-none`}
              data-state={tabValue === "review"}>
              <Link href={`/project/${projectId}/review`} className="w-full text-center">
                Review
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {children}
      </Suspense>
    </div>
  );
}
