"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelect from "@/components/ui/multi-select"; // Import the MultiSelect component

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const sustainabilityDimensionsOptions = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "ENVIRONMENTAL", label: "Environmental" },
  { value: "SOCIAL", label: "Social" },
  { value: "ECONOMIC", label: "Economic" },
  { value: "TECHNICAL", label: "Technical" },
];

export default function BoardFilters({ issues, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedDimensions, setSelectedDimensions] = useState([]);

  const assignees = issues
    .map((issue) => issue.assignee)
    .filter(
      (item, index, self) => index === self.findIndex((t) => t && t.id === item.id)
    );

  useEffect(() => {
    const filteredIssues = issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAssignees.length === 0 ||
          selectedAssignees.includes(issue.assignee?.id)) &&
        (selectedPriority === "" || issue.priority === selectedPriority) &&
        (selectedDimensions.length === 0 ||
          selectedDimensions.every((dim) =>
            issue.sustainabilityDimensions.includes(dim)
          ))
    );
    onFilterChange(filteredIssues);
  }, [searchTerm, selectedAssignees, selectedPriority, selectedDimensions, issues]);

  const toggleAssignee = (assigneeId) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignees([]);
    setSelectedPriority("");
    setSelectedDimensions([]);
  };

  const isFiltersApplied =
    searchTerm !== "" ||
    selectedAssignees.length > 0 ||
    selectedPriority !== "" ||
    selectedDimensions.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6 text-black">
        <Input
          className="w-full sm:w-72 text-black border rounded-md bg-white" // Added border and padding
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex-shrink-0">
          <div className="flex gap-2 flex-wrap">
            {assignees.map((assignee, i) => {
              const selected = selectedAssignees.includes(assignee.id);

              return (
                <div
                  key={assignee.id}
                  className={`rounded-full ring ${
                    selected ? "ring-blue-600" : "ring-black"
                  } ${i > 0 ? "-ml-6" : ""}`}
                  style={{
                    zIndex: i,
                  }}
                  onClick={() => toggleAssignee(assignee.id)}
                >
                  <Avatar className="h-10 w-10 border border-gray-300"> 
                    <AvatarImage src={assignee.imageUrl} />
                    <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>

        {/* Select for Priority with Border */}
        <Select value={selectedPriority} onValueChange={setSelectedPriority} className="border rounded-md p-2">
          <SelectTrigger className="w-full sm:w-52 border rounded-md p-2 text-black bg-white ">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* MultiSelect for Sustainability Dimensions with Border */}
        <MultiSelect
          options={sustainabilityDimensionsOptions}
          value={selectedDimensions}
          onChange={setSelectedDimensions}
          labelledBy="Select dimensions"
          className="border rounded-md p-2 text-black"  // Added border
        />

        {/* Clear Filters Button */}
        {isFiltersApplied && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center border rounded-md p-2"
          >
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
