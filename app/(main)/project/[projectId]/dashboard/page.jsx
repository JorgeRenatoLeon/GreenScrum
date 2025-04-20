"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, addDays } from "date-fns";

import { sprintSchema } from "@/app/lib/validators";
import useFetch from "@/hooks/use-fetch";
import { createSprint } from "@/actions/sprints";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { PlusIcon } from "lucide-react";

export default function Dashboard({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}) {
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });
  const router = useRouter();

  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid = false }
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      goal: "",
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
    mode: "onChange", // On change to trigger validation after each field edit
  });
  // onSubmit handler
  const onSubmit = async (data) => {
    if (!data.name || !data.goal || !data.startDate || !data.endDate) {
    const error =("Required fields are missing");
      return error; // Prevent form submission if required fields are not filled
    }

    await createSprintFn(projectId, {
      ...data,
      goal: data.goal, // Make sure goal is properly passed
    startDate: dateRange.from,
    endDate: dateRange.to,
    });

    setShowForm(false); // Close form after successful submission
    router.refresh(); // Refresh the page to show updated data
  };

  useEffect(() => {
    if (!sprintKey) {
      const currentRoute = window.location.pathname;
      // Extract projectId from the URL is the second last segment
      // Assuming the URL structure is /project/[projectId]/dashboard
      const projectIdCurrent = currentRoute.split("/").slice(-2, -1)[0];
      // Log the current route and projectId
      // console.log("Current Route:", currentRoute);
      // console.log("Project ID:", projectIdCurrent);
      // Redirect to the project page if no sprintKey is provided
      router.push(`/project/${projectIdCurrent}`);
    }
  }, []);

  return (
    <>
<div className="flex justify-between items-center pb-4">
  <div className="flex items-center gap-2">
    <h2 className="text-black text-xl font-bold">Project:</h2>
    <h1 className="text-xl font-bold text-black">{projectTitle}</h1>
  </div>
  {!showForm && (
    <Button
      className="mt-2 flex items-center gap-1"
      onClick={() => setShowForm(true)}
      variant="default"
    >
      Create New Sprint <PlusIcon className="mr-2 h-4 w-4" />
    </Button>
  )}
</div>

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transition-transform transform ${
          showForm ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Title Section with Background */}
        <div className="bg-[hsl(178.5,52.96%,38.6%)] p-4">
          <h2 className="text-white text-lg font-semibold">Create New Sprint</h2>
        </div>
        <hr className="border-gray-300" />

        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            {/* Sprint Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-black">
                Sprint Name <span className="text-red-500">*</span>
              </label>
              <Input id="name" {...register("name")} readOnly className="bg-white text-black" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Sprint Goal */}
            <div>
              <label htmlFor="goal" className="block text-sm font-medium mb-1 text-black">
                Sprint Goal <span className="text-red-500">*</span>
              </label>
              <Input
                id="goal"
                {...register("goal")}
                className="bg-white text-black"
                placeholder="Enter Sprint Goal"
              />
              {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal.message}</p>}
            </div>

            {/* Sprint Duration (Calendar) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Sprint Duration <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="dateRange"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal bg-white text-black ${
                          !dateRange && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from && dateRange.to ? (
                          format(dateRange.from, "LLL dd, y") +
                          " - " +
                          format(dateRange.to, "LLL dd, y")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto bg-slate-900" align="start">
                      <DayPicker
                        classNames={{
                          chevron: "fill-blue-500",
                          range_start: "bg-blue-700",
                          range_end: "bg-blue-700",
                          range_middle: "bg-blue-400",
                          day_button: "border-none",
                          today: "border-2 border-blue-700",
                        }}
                        mode="range"
                        disabled={[{ before: new Date() }]}
                        selected={dateRange}
                        onSelect={(range) => {
                          if (range?.from && range?.to) {
                            setDateRange(range);
                            field.onChange(range);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            {/* Submit and Cancel Buttons at bottom right */}
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="destructive"
                className="bg-red-500 text-white"
                onClick={() => setShowForm(false)} // Cancel button action
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || createSprintLoading} // Disable when invalid or loading
                className={`${
                  isValid && !createSprintLoading
                    ? "bg-[hsl(178.5,52.96%,38.6%)] text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
