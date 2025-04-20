import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import SprintCreationForm from "../_components/create-sprint";
import SprintBoard from "../_components/sprint-board";
import { Button } from "@/components/ui/button";
import NewBacklog from "../_components/new-backlog";

export default async function ProjectPage({ params }) {
  const { projectId } = params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto bg-white text-black p-4">
      {project.sprints.length > 0 ? (
        <SprintCreationForm
          projectTitle={project.name}
          projectId={projectId}
          projectKey={project.key}
          sprintKey={project.sprints?.length + 1}
        />
      ) : (
        <NewBacklog
          projectTitle={project.name}
          projectId={projectId}
        />
      )}

      {project.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={projectId}
          orgId={project.organizationId}
        />
      ) : (
        <div>Create a Product Backlog for {project.name} from the button above</div>
      )}
    </div>
  );
}
