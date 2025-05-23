"use client";

import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import useFetch from "@/hooks/use-fetch";
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organizations";
import { issueSchema } from "@/app/lib/validators";
import MultiSelect from "@/components/ui/multi-select"; // Import the MultiSelect component

const sustainabilityDimensionsOptions = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "ENVIRONMENTAL", label: "Environmental" },
  { value: "SOCIAL", label: "Social" },
  { value: "ECONOMIC", label: "Economic" },
  { value: "TECHNICAL", label: "Technical" },
];

export default function IssueCreationDialog({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) {
  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
      sustainabilityDimensions: [],
      storyPoints: "",
      sustainabilityPoints: "",
      acceptanceCriteria: "",
      sustainabilityCriteria: "",
    },
  });

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId);
    }
  }, [isOpen, orgId]);

  const onSubmit = async (data) => {
    // Parse storyPoints and sustainabilityPoints as numbers
    const parsedData = {
      ...data,
      storyPoints: data.storyPoints ? parseInt(data.storyPoints, 10) : null,
      sustainabilityPoints: data.sustainabilityPoints ? parseInt(data.sustainabilityPoints, 10) : null,
    };

    console.log("Submitting data:", parsedData); // Debugging statement
    await createIssueFn(projectId, {
      ...parsedData,
      status,
      sprintId,
    });
  };

  const handleClose = () => {
    reset();
    // Set body overflow to auto
    document.body.style.overflow = "auto";
    // Reset the scroll position
    window.scrollTo(0, 0);
    // Close the dialog
    onClose();
  };

  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newIssue, createIssueLoading]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>
        {usersLoading && <BarLoader width={"100%"} color="#36d7b7" />}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="assigneeId"
              className="block text-sm font-medium mb-1"
            >
              Assignee
            </label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assigneeId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.assigneeId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <label
              htmlFor="sustainabilityDimensions"
              className="block text-sm font-medium mb-1"
            >
              Sustainability Dimensions
            </label>
            <Controller
              name="sustainabilityDimensions"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={sustainabilityDimensionsOptions}
                  value={field.value}
                  onChange={field.onChange}
                  labelledBy="Select dimensions"
                />
              )}
            />
            {errors.sustainabilityDimensions && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sustainabilityDimensions.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="storyPoints"
              className="block text-sm font-medium mb-1"
            >
              Story Points
            </label>
            <Input
              type="number"
              min="0"
              max="10"
              id="storyPoints"
              {...register("storyPoints", { valueAsNumber: true })}
            />
            {errors.storyPoints && (
              <p className="text-red-500 text-sm mt-1">
                {errors.storyPoints.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="sustainabilityPoints"
              className="block text-sm font-medium mb-1"
            >
              Sustainability Points
            </label>
            <Input
              type="number"
              min="0"
              max="10"
              id="sustainabilityPoints"
              {...register("sustainabilityPoints", { valueAsNumber: true })}
            />
            {errors.sustainabilityPoints && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sustainabilityPoints.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="acceptanceCriteria"
              className="block text-sm font-medium mb-1"
            >
              Acceptance Criteria
            </label>
            <Input
              id="acceptanceCriteria"
              {...register("acceptanceCriteria")}
            />
            {errors.acceptanceCriteria && (
              <p className="text-red-500 text-sm mt-1">
                {errors.acceptanceCriteria.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="sustainabilityCriteria"
              className="block text-sm font-medium mb-1"
            >
              Sustainability Criteria
            </label>
            <Input
              id="sustainabilityCriteria"
              {...register("sustainabilityCriteria")}
            />
            {errors.sustainabilityCriteria && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sustainabilityCriteria.message}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 mt-2">{error.message}</p>}
          <Button
            type="submit"
            disabled={createIssueLoading}
            className="w-full"
          >
            {createIssueLoading ? "Creating..." : "Create Issue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}