import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganization } from "@/actions/organizations";
import OrgSwitcher from "@/components/org-switcher";
import ProjectList from "./_components/project-list";
import UserIssues from "./_components/user-issues";
import Link from "next/link";  
import { Button } from "@/components/ui/button"; 
import { PenBox } from "lucide-react"; 

export default async function OrganizationPage({ params }) {
  const { orgId } = params;
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const organization = await getOrganization(orgId);

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        {/* Organization Name */}
        <h1 className="text-3xl font-bold pb-2">
          {organization.name}&rsquo;s Projects
        </h1>

        {/* Organization Switcher and Create Project button in a flex row */}
        <div className="flex gap-4 items-center">
          <OrgSwitcher />
          <Link href="/project/create">
            <Button variant="destructive" className="flex items-center gap-2">
              <PenBox size={18} />
              <span className="hidden md:inline">Create Project</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-4">
        {/* Display Project List */}
        <ProjectList orgId={organization.id} />
      </div>

      <div className="mt-8">
        {/* Display User Issues */}
        <UserIssues userId={userId} />
      </div>
    </div>
  );
}
