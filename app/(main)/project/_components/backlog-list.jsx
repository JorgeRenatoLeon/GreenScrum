"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

import { getIssues, updateIssue } from "@/actions/issues";

import IssueCreationDrawer from "./create-issue";
import IssueCard from "@/components/issue-card";
import BoardFilters from "./board-filters";

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default function SprintBoard({ sprints, projectId, orgId }) {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssues);

  const [filteredIssues, setFilteredIssues] = useState(issues);

  const handleFilterChange = (newFilteredIssues) => {
    setFilteredIssues(newFilteredIssues);
  };

  useEffect(() => {
    if (projectId) {
        console.log("fetching issues", projectId);
      fetchIssues(projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

    useEffect(() => {
        console.log("issues", issues);
        setFilteredIssues(issues ? issues.filter(issue => !issue.sprintId) : null);
    }, [issues]);

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handleIssueCreated = () => {
    fetchIssues(projectId);
  };

  const {
    fn: updateIssueFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssue);

  if (issuesError) return <div>Error loading issues</div>;

  return (
    <div className="flex flex-col gap-3">
      {updateIssuesError && (
        <p className="text-red-500 mt-2">{updateIssuesError.message}</p>
      )}
      {(updateIssuesLoading || issuesLoading) && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

        {issues && !issuesLoading && filteredIssues ? filteredIssues
            .map((issue, index) => (
                <IssueCard
                    key={issue.id}
                    issue={issue}
                    onDelete={() => fetchIssues(projectId)}
                    onUpdate={(updated) =>
                    setIssues((issues) =>
                        issues.map((issue) => {
                        if (issue.id === updated.id) return updated;
                        return issue;
                        })
                    )
                    }
                />
        ))
    
        : null}
        <Button
            variant="ghost"
            className="w-full bg-black text-white"
            onClick={() => handleAddIssue("TODO")}
        >
        <Plus className="mr-2 h-4 w-4" />
            Create PBI
        </Button>

        <IssueCreationDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            sprintId={null}
            status={selectedStatus}
            projectId={projectId}
            onIssueCreated={handleIssueCreated}
            orgId={orgId}
        />
    </div>
  );
}