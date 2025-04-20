"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaLeaf, FaUser, FaDollarSign, FaCog, FaUsers } from 'react-icons/fa';
// import { saveReviewResponses } from "@/actions/sprints";

const dimensionIcons = {
  INDIVIDUAL: <FaUser className="text-blue-500" />,
  ENVIRONMENTAL: <FaLeaf className="text-green-500" />,
  SOCIAL: <FaUsers className="text-purple-500" />,
  ECONOMIC: <FaDollarSign className="text-yellow-500" />,
  TECHNICAL: <FaCog className="text-gray-500" />,
};

export default function ReviewPage() {
    const sprintId = "sprint-123"; // Define sprintId directly in the component

    const [backlogItems, setBacklogItems] = useState([
        {
            id: 1,
            title: "User Authentication",
            description: "Implement secure login/logout functionality.",
            actions: ["Login", "Signup"],
            sustainability: ["TECHNICAL", "ECONOMIC"],
            priority: "High",
        },
        {
            id: 2,
            title: "Dark Mode Support",
            description: "Provide a toggle for dark mode.",
            actions: ["UI", "Accessibility"],
            sustainability: ["INDIVIDUAL", "TECHNICAL"],
            priority: "Medium",
        },
    ]);

    const [expandedItems, setExpandedItems] = useState({});
    const [reviewResponses, setReviewResponses] = useState({});
    const [feedback, setFeedback] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleExpand = (id) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleResponseChange = (itemId, question, response) => {
        setReviewResponses((prev) => ({
            ...prev,
            [itemId]: { ...prev[itemId], [question]: response },
        }));
    };

    const handleFeedbackChange = (itemId, value) => {
        setFeedback((prev) => ({
            ...prev,
            [itemId]: value,
        }));
    };

    const handleSubmit = async (itemId) => {
        try {
            setIsSubmitting(true); // Disable the submit button

            // Prepare the responses object (can be empty for testing)
            const responses = reviewResponses[itemId] || {};

            // Save the responses and feedback to the database
            // await saveReviewResponses(sprintId, itemId, responses, feedback[itemId] || "");

            // Show success message
            toast.success("Review submitted successfully!");
        } catch (error) {
            // Show error message
            toast.error("Failed to submit review: " + error.message);
        } finally {
            setIsSubmitting(false); // Re-enable the submit button
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Sprint Review</h1>
            {backlogItems.length === 0 ? (
                <p>No backlog items available.</p>
            ) : (
                backlogItems.map((item) => (
                    <Card key={item.id} className="mb-4 rounded-xl border text-card-foreground shadow cursor-pointer hover:shadow-md transition-shadow bg-white">
                        <CardContent className="flex flex-col gap-4">
                            {/* Clickable PBI Title */}
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => toggleExpand(item.id)}
                            >
                                <h3 className="text-lg font-semibold hover:underline">
                                    {item.title}
                                </h3>
                                {expandedItems[item.id] ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </div>

                            <p>{item.description}</p>

                            <div className="flex gap-2">
                                {item.actions.map((action, index) => (
                                    <Badge key={index}>{action}</Badge>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                {item.sustainability.map((tag, index) => (
                                    <span key={index} title={tag}>
                                        {dimensionIcons[tag]}
                                    </span>
                                ))}
                            </div>

                            <p className="text-sm">Priority: {item.priority}</p>

                            {/* Review Section (Hidden by Default) */}
                            {expandedItems[item.id] && (
                                <div className="mt-4 border-t pt-4">
                                    {/* Question 1 */}
                                    <p className="font-medium">Was it fully implemented according to the acceptance criteria?</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            variant={reviewResponses[item.id]?.completed === "yes" ? "default" : "outline"}
                                            onClick={() => handleResponseChange(item.id, "completed", "yes")}
                                            className={reviewResponses[item.id]?.completed === "yes" ? "bg-blue-600 text-white" : "text-black border-gray-300"} // Highlight selected button
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            variant={reviewResponses[item.id]?.completed === "no" ? "default" : "outline"}
                                            onClick={() => handleResponseChange(item.id, "completed", "no")}
                                            className={reviewResponses[item.id]?.completed === "no" ? "bg-red-600 text-white" : "text-black border-gray-300"} // Highlight selected button
                                        >
                                            No
                                        </Button>
                                    </div>

                                    {/* Question 2 */}
                                    <p className="font-medium mt-4">Does it pass all functional and non-functional requirements?</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            variant={reviewResponses[item.id]?.acceptance === "yes" ? "default" : "outline"}
                                            onClick={() => handleResponseChange(item.id, "acceptance", "yes")}
                                            className={reviewResponses[item.id]?.acceptance === "yes" ? "bg-blue-600 text-white" : "text-black border-gray-300"} // Highlight selected button
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            variant={reviewResponses[item.id]?.acceptance === "no" ? "default" : "outline"}
                                            onClick={() => handleResponseChange(item.id, "acceptance", "no")}
                                            className={reviewResponses[item.id]?.acceptance === "no" ? "bg-red-600 text-white" : "text-black border-gray-300"} // Highlight selected button
                                        >
                                            No
                                        </Button>
                                    </div>

                                    {/* Question 3 */}
                                    <p className="font-medium mt-4">Were all relevant tests (unit, integration, regression) successfully executed?</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            variant={reviewResponses[item.id]?.testsExecuted === "yes" ? "default" : "outline"}
                                            onClick={() => handleResponseChange(item.id, "testsExecuted", "yes")}
                                            className={reviewResponses[item.id]?.testsExecuted === "yes" ? "bg-blue-600 text-white" : "text-black border-gray-300"} // Highlight selected button
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            variant={reviewResponses[item.id]?.testsExecuted === "no" ? "default" : "outline"}
                                            onClick={() => handleResponseChange(item.id, "testsExecuted", "no")}
                                            className={reviewResponses[item.id]?.testsExecuted === "no" ? "bg-red-600 text-white" : "text-black border-gray-300"} // Highlight selected button
                                        >
                                            No
                                        </Button>
                                    </div>

                                    {/* Question 4 */}
                                    <p className="font-medium mt-4">Were any defects or issues identified that prevent acceptance?</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            variant={reviewResponses[item.id]?.defectsIdentified === "yes" ? "default" : "outline"}
                                            onClick={() => handleResponseChange(item.id, "defectsIdentified", "yes")}
                                            className={reviewResponses[item.id]?.defectsIdentified === "yes" ? "bg-blue-600 text-white" : "text-black border-gray-300"} // Highlight selected button
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            variant={reviewResponses[item.id]?.defectsIdentified === "no" ? "default" : "outline"}
                                            onClick={() => handleResponseChange(item.id, "defectsIdentified", "no")}
                                            className={reviewResponses[item.id]?.defectsIdentified === "no" ? "bg-red-600 text-white" : "text-black border-gray-300"} // Highlight selected button
                                        >
                                            No
                                        </Button>
                                    </div>

                                    {/* Question 5 */}
                                    <p className="font-medium mt-4">Is the delivered functionality ready for release (if applicable)?</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            variant={reviewResponses[item.id]?.readyForRelease === "yes" ? "default" : "outline"}
                                            onClick={() => handleResponseChange(item.id, "readyForRelease", "yes")}
                                            className={reviewResponses[item.id]?.readyForRelease === "yes" ? "bg-blue-600 text-white" : "text-black border-gray-300"} // Highlight selected button
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            variant={reviewResponses[item.id]?.readyForRelease === "no" ? "default" : "outline"}
                                            onClick={() => handleResponseChange(item.id, "readyForRelease", "no")}
                                            className={reviewResponses[item.id]?.readyForRelease === "no" ? "bg-red-600 text-white" : "text-black border-gray-300"} // Highlight selected button
                                        >
                                            No
                                        </Button>
                                    </div>

                                    {/* Feedback */}
                                    <p className="font-medium mt-4">Feedback:</p>
                                    <Textarea
                                        placeholder="Provide additional feedback..."
                                        value={feedback[item.id] || ""}
                                        onChange={(e) => handleFeedbackChange(item.id, e.target.value)}
                                    />

                                    {/* Submit Button */}
                                    <div className="mt-4">
                                        <Button
                                            onClick={() => handleSubmit(item.id)}
                                            className={`bg-blue-600 text-white hover:bg-blue-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    Submitting...
                                                </div>
                                            ) : (
                                                "Submit"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}