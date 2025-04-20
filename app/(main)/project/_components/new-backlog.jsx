'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function NewBacklog({ projectTitle, projectId }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const handleCreateBacklog = async () => {
        setIsLoading(true);
        // Simulate a network request
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push(`/project/${projectId}/productbacklog`);
    };
    
    return (
        <div className="flex justify-between items-center pb-4">
            <div className="flex items-center gap-2">
                <h2 className="text-black text-xl font-bold">Project:</h2>
                <h1 className="text-xl font-bold text-black">{projectTitle}</h1>
            </div>
            <Button
                className="mt-2 flex items-center gap-1"
                onClick={handleCreateBacklog}
                variant="default"
                disabled={isLoading}
            >
                {isLoading ? "Creating Backlog..." : `Create Product Backlog`}
            </Button>
        </div>
    );
}