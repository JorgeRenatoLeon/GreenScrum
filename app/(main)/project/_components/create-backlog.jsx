'use client'

import React, { useEffect, useState } from 'react';
import useFetch from "@/hooks/use-fetch";

import { Button } from "@/components/ui/button";
import AiItengration from "./ai-integration";

import { useRouter } from 'next/navigation';

import { createIssue } from "@/actions/issues";
import { SustainabilityDimension } from '@prisma/client';

const CreateBacklog = ({projectId}) => {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(2);

    const [requirements, setRequirements] = useState([]);
    const [requirement, setRequirement] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    const [issues, setIssues] = useState([]);
    const [editingIssueIndex, setEditingIssueIndex] = useState(null);
    const [editedIssue, setEditedIssue] = useState({});

    const [searchText, setSearchText] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [dimensionFilter, setDimensionFilter] = useState('');

    const {
      loading: createIssueLoading,
      fn: createIssueFn,
      error,
      data: newIssue,
    } = useFetch(createIssue);

    const sustainabilityOptions = ["Human", "Technical", "Environmental", "Economic"];

    const handleAddRequirement = () => {
        if (requirement.trim()) {
            setRequirements([...requirements, requirement]);
            setRequirement('');
        }
    };

    const handleEditRequirement = (index) => {
        setEditingIndex(index);
    };

    const handleUpdateRequirement = (index, updatedRequirement) => {
        const updatedRequirements = [...requirements];
        updatedRequirements[index] = updatedRequirement;
        setRequirements(updatedRequirements);
    };

    const handleDeleteRequirement = (index) => {
        const updatedRequirements = requirements.filter((_, i) => i !== index);
        setRequirements(updatedRequirements);
    };

    const updateIssues = (newIssues) => {
        setIssues(newIssues);
    }

    const handleEditIssue = (index) => {
        setEditingIssueIndex(index);
        setEditedIssue(issues[index]);
    };

    const handleUpdateIssue = (index) => {
        const updatedIssues = [...issues];
        updatedIssues[index] = editedIssue;
        setIssues(updatedIssues);
        setEditingIssueIndex(null);
    };

    const handleDeleteIssue = (index) => {
        const updatedIssues = issues.filter((_, i) => i !== index);
        setIssues(updatedIssues);
    };

    const handleAddTag = (tag) => {
        if (!editedIssue.sustainability_dimensions.includes(tag)) {
            setEditedIssue({
                ...editedIssue,
                sustainability_dimensions: [...editedIssue.sustainability_dimensions, tag]
            });
        }
    };

    const handleRemoveTag = (tag) => {
        setEditedIssue({
            ...editedIssue,
            sustainability_dimensions: editedIssue.sustainability_dimensions.filter(t => t !== tag)
        });
    };

    const createProductBacklog = async () => {
        // Create product backlog
        for (let issue of issues) {
            console.log("Form data being submitted:", issue); // Log the form data to check if sustainabilityDimensions are included
            // Format issue to db schema and create issue
            const newIssue = {
                "assigneeId": null,
                "description": issue.backlog_description,
                "priority": issue.priority ? issue.priority.toUpperCase() : "Medium",
                "sprintId": null,
                "status": "TODO",
                "sustainabilityDimensions": issue.sustainability_dimensions.map(dimension => SustainabilityDimension[dimension.toUpperCase()]),
                "sustainabilityPoints": parseInt(issue.sustainability_points, 10),
                "storyPoints": parseInt(issue.story_points, 10),
                "acceptanceCriteria": issue.acceptance_criteria,
                "sustainabilityCriteria": issue.sustainability_criteria,
                "title": issue.backlog_title
            };
            await createIssueFn(projectId, newIssue);
        }
        router.refresh();
    };

    useEffect(() => {
        if (issues.length > 0) {
            setCurrentStep(3);
        }
    }, [issues]);

    const filteredIssues = issues.filter(issue => {
        const matchesSearchText = issue.backlog_title.toLowerCase().includes(searchText.toLowerCase()) ||
            issue.backlog_description.toLowerCase().includes(searchText.toLowerCase());
        const matchesPriority = priorityFilter ? issue.priority === priorityFilter : true;
        const matchesDimension = dimensionFilter ? issue.sustainability_dimensions.includes(dimensionFilter) : true;
        return matchesSearchText && matchesPriority && matchesDimension;
    });

    return (
        <>
        {
            currentStep === 1 ? (
                <Button
                className="mt-2 flex items-center gap-1"
                onClick={() => setCurrentStep(2)}
                variant="default"
                >
                Create a new Product Backlog
                </Button>
            ) : currentStep === 2 ? (
                <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6">Product Requirements and SusAF Recommendations</h1>
                    
                    <div className="container mx-auto">
                        <AiItengration
                            requirements={requirements}
                            updateIssues={updateIssues}
                        />
                    </div>
                    <div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddRequirement();
                            }}
                        >
                            <input
                                type="text"
                                value={requirement}
                                onChange={(e) => setRequirement(e.target.value)}
                                placeholder="Add a new requirement"
                                className="border p-2 mr-2"
                            />
                            <Button type="submit" variant="default">
                                Add Requirement
                            </Button>
                        </form>
                        <ul className="mt-4">
                            {requirements.map((req, index) => (
                                <li key={index} className="border-b py-2 flex justify-between items-center">
                                    {editingIndex === index ? (
                                        <input
                                            type="text"
                                            value={req}
                                            onChange={(e) => handleUpdateRequirement(index, e.target.value)}
                                            className="border p-2 mr-2"
                                        />
                                    ) : (
                                        req
                                    )}
                                    <div className='flex gap-2'>
                                        {editingIndex === index ? (
                                            <Button variant="default" onClick={() => setEditingIndex(null)}>
                                                Save
                                            </Button>
                                        ) : (
                                            <>
                                                <Button variant="default" onClick={() => handleEditRequirement(index)}>
                                                    Edit
                                                </Button>
                                                <Button variant="default" onClick={() => handleDeleteRequirement(index)}>
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
            : createIssueLoading ? (<p>Loading...</p>) : (
                <div className="container mx-auto p-6">
                    <Button
                        className="mb-2 flex gap-1 ml-auto"
                        onClick={() => setCurrentStep(1)}
                        variant="default"
                    >
                        Return to previous step
                    </Button>
                    <h1 className="text-3xl font-bold mb-6">Generated Backlog</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search by text"
                            className="border p-2 mr-2"
                        />
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="border p-2 mr-2"
                        >
                            <option value="">Filter by Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <select
                            value={dimensionFilter}
                            onChange={(e) => setDimensionFilter(e.target.value)}
                            className="border p-2"
                        >
                            <option value="">Filter by Sustainability Dimension</option>
                            {sustainabilityOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Backlog Title</th>
                                <th className="py-2">Backlog Description</th>
                                <th className="py-2">Priority</th>
                                <th className="py-2">User Story Description</th>
                                <th className="py-2">Story Points</th>
                                <th className="py-2">Sustainability Points</th>
                                <th className="py-2">Acceptance Criteria</th>
                                <th className="py-2">Sustainability Criteria</th>
                                <th className="py-2">Sustainability Dimensions</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIssues.map((issue, index) => (
                                <tr key={index} className="border-t">
                                    {editingIssueIndex === index ? (
                                        <>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={editedIssue.backlog_title}
                                                    onChange={(e) => setEditedIssue({ ...editedIssue, backlog_title: e.target.value })}
                                                    className="border p-2"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={editedIssue.backlog_description}
                                                    onChange={(e) => setEditedIssue({ ...editedIssue, backlog_description: e.target.value })}
                                                    className="border p-2"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={editedIssue.priority}
                                                    onChange={(e) => setEditedIssue({ ...editedIssue, priority: e.target.value })}
                                                    className="border p-2"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={editedIssue.userstory_description}
                                                    onChange={(e) => setEditedIssue({ ...editedIssue, userstory_description: e.target.value })}
                                                    className="border p-2"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={editedIssue.story_points}
                                                    onChange={(e) => setEditedIssue({ ...editedIssue, story_points: e.target.value })}
                                                    className="border p-2"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={editedIssue.sustainability_points}
                                                    onChange={(e) => setEditedIssue({ ...editedIssue, sustainability_points: e.target.value })}
                                                    className="border p-2"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={editedIssue.acceptance_criteria}
                                                    onChange={(e) => setEditedIssue({ ...editedIssue, acceptance_criteria: e.target.value })}
                                                    className="border p-2"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={editedIssue.sustainability_criteria}
                                                    onChange={(e) => setEditedIssue({ ...editedIssue, sustainability_criteria: e.target.value })}
                                                    className="border p-2"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {editedIssue.sustainability_dimensions.map((tag, tagIndex) => (
                                                        <span key={tagIndex} className="bg-gray-200 p-1 rounded">
                                                            {tag}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveTag(tag)}
                                                                className="ml-1 text-red-500"
                                                            >
                                                                x
                                                            </button>
                                                        </span>
                                                    ))}
                                                    <select
                                                        onChange={(e) => handleAddTag(e.target.value)}
                                                        className="border p-2"
                                                    >
                                                        <option value="">Add Dimension</option>
                                                        {sustainabilityOptions.map((option, optionIndex) => (
                                                            <option key={optionIndex} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4">
                                                <Button variant="default" onClick={() => handleUpdateIssue(index)}>
                                                    Save
                                                </Button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="py-2 px-4">{issue.backlog_title}</td>
                                            <td className="py-2 px-4">{issue.backlog_description}</td>
                                            <td className="py-2 px-4">{issue.priority}</td>
                                            <td className="py-2 px-4">{issue.userstory_description}</td>
                                            <td className="py-2 px-4">{issue.story_points}</td>
                                            <td className="py-2 px-4">{issue.sustainability_points}</td>
                                            <td className="py-2 px-4">{issue.acceptance_criteria}</td>
                                            <td className="py-2 px-4">{issue.sustainability_criteria}</td>
                                            <td className="py-2 px-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {issue.sustainability_dimensions.map((tag, tagIndex) => (
                                                        <span key={tagIndex} className="bg-gray-200 p-1 rounded">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-2 px-4">
                                                <Button variant="default" onClick={() => handleEditIssue(index)}>
                                                    Edit
                                                </Button>
                                                <Button variant="default" onClick={() => handleDeleteIssue(index)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button
                        className="mt-4"
                        onClick={createProductBacklog}
                        variant="default"
                    >
                        Create Product Backlog
                    </Button>
                </div>
            )
        }
        </>
    );
};

export default CreateBacklog;