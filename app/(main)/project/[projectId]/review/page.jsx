"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReviewPage() {
  const [backlogItems, setBacklogItems] = useState([
    {
      id: 1,
      title: "User Authentication",
      description: "Implement secure login/logout functionality.",
      actions: ["Login", "Signup"],
      sustainability: ["Technology", "Security"],
      priority: "High",
    },
    {
      id: 2,
      title: "Dark Mode Support",
      description: "Provide a toggle for dark mode.",
      actions: ["UI", "Accessibility"],
      sustainability: ["Individual", "Technology"],
      priority: "Medium",
    },
  ]);

  const [expandedItems, setExpandedItems] = useState({});
  const [reviewResponses, setReviewResponses] = useState({});
  const [feedback, setFeedback] = useState({});

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sprint Review</h1>
      {backlogItems.length === 0 ? (
        <p>No backlog items available.</p>
      ) : (
        backlogItems.map((item) => (
          <Card key={item.id} className="mb-4">
            <CardContent className="flex flex-col gap-4">
              {/* Clickable PBI Title */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(item.id)}
              >
                <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                  {item.title}
                </h3>
                {expandedItems[item.id] ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>

              <p className="text-gray-400">{item.description}</p>

              <div className="flex gap-2">
                {item.actions.map((action, index) => (
                  <Badge key={index}>{action}</Badge>
                ))}
              </div>

              <div className="flex gap-2">
                {item.sustainability.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-sm">Priority: {item.priority}</p>

              {/* Review Section (Hidden by Default) */}
              {expandedItems[item.id] && (
                <div className="mt-4 border-t pt-4">
                  <p className="font-medium">Was this PBI completed as expected?</p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={
                        reviewResponses[item.id]?.completed === "yes" ? "default" : "outline"
                      }
                      onClick={() => handleResponseChange(item.id, "completed", "yes")}
                    >
                      Yes
                    </Button>
                    <Button
                      variant={reviewResponses[item.id]?.completed === "no" ? "default" : "outline"}
                      onClick={() => handleResponseChange(item.id, "completed", "no")}
                    >
                      No
                    </Button>
                  </div>

                  <p className="font-medium mt-4">Does this meet the acceptance criteria?</p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={
                        reviewResponses[item.id]?.acceptance === "yes" ? "default" : "outline"
                      }
                      onClick={() => handleResponseChange(item.id, "acceptance", "yes")}
                    >
                      Yes
                    </Button>
                    <Button
                      variant={
                        reviewResponses[item.id]?.acceptance === "no" ? "default" : "outline"
                      }
                      onClick={() => handleResponseChange(item.id, "acceptance", "no")}
                    >
                      No
                    </Button>
                  </div>

                  <p className="font-medium mt-4">Feedback:</p>
                  <Textarea
                    placeholder="Provide additional feedback..."
                    value={feedback[item.id] || ""}
                    onChange={(e) => handleFeedbackChange(item.id, e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
