"use client"

import { Suspense } from "react";
import { usePathname, notFound } from "next/navigation";
import { BarLoader } from "react-spinners";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export  default function ProjectLayout({ params, children }) {
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

  return (
    <div className="mx-auto w-full">
      <Suspense fallback={<BarLoader width={"100%"} color="#36d7b7" />}>
        <Tabs value={tabValue} className="w-full mt-5">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="dashboard" asChild>
              <Link href={`/project/${projectId}`} className="w-full text-center">
                Dashboard
              </Link>
            </TabsTrigger>
            <TabsTrigger value="backlog" asChild>
              <Link href={`/project/${projectId}/productbacklog`} className="w-full text-center">
                Product Backlog
              </Link>
            </TabsTrigger>
            <TabsTrigger value="sprints" asChild>
              <Link href={`/project/${projectId}/sprints`} className="w-full text-center">
                Sprints
              </Link>
            </TabsTrigger>
            <TabsTrigger value="retrospective" asChild>
              <Link href={`/project/${projectId}/retrospective`} className="w-full text-center">
                Retrospective
              </Link>
            </TabsTrigger>
            <TabsTrigger value="review" asChild>
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
