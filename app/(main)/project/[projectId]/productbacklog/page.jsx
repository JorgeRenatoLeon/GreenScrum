"use server"
import { getProject } from "@/actions/projects";
import { getIssues } from "@/actions/issues";
import { notFound } from "next/navigation";
import SprintBoard from "../../_components/sprint-board";
import CreateBacklog from "../../_components/create-backlog";

export default async function ProductBacklog({ params }) {
  const { projectId } = params;
  const project = await getProject(projectId);
  let issues = await getIssues(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Backlog</h1>
      
      <div className="container mx-auto">
  
        {issues.length > 0 ? (
          <SprintBoard
            sprints={project.sprints}
            projectId={projectId}
            orgId={project.organizationId}
          />
        ) : (
          <CreateBacklog />
        )}
      </div>
    </div>
  );
}
