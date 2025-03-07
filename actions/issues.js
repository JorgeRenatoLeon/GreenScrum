"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getIssuesForSprint(sprintId) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const issues = await db.issue.findMany({
    where: { sprintId: sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issues;
}

export async function getIssues() {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const issues = await db.issue.findMany({
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issues;
}

export async function createIssue(projectId, data) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  let user = await db.user.findUnique({ where: { clerkUserId: userId } });

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;


  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId: projectId,
      sprintId: data.sprintId,
      reporterId: user.id,
      assigneeId: data.assigneeId || null,
      order: newOrder,
      sustainabilityDimensions: data.sustainabilityDimensions || [], // Ensure this is passed correctly
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });


  return issue;
}

export async function deleteIssue(issueId) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (
    issue.reporterId !== user.id &&
    !issue.project.adminIds.includes(user.id)
  ) {
    throw new Error("You don't have permission to delete this issue");
  }

  await db.issue.delete({ where: { id: issueId } });

  return { success: true };
}

export async function updateIssue(issueId, data) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    const updatedIssue = await db.issue.update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return updatedIssue;
  } catch (error) {
    throw new Error("Error updating issue: " + error.message);
  }
}

/*export async function saveReviewResponses(sprintId, itemId, responses, feedback) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    // Save the review responses and feedback to the database
    const review = await db.review.upsert({
      where: { itemId_sprintId: { itemId, sprintId } }, // Unique constraint for itemId and sprintId
      update: {
        responses: responses, // Update the responses
        feedback: feedback, // Update the feedback
      },
      create: {
        sprintId: sprintId,
        itemId: itemId,
        responses: responses, // Create new responses
        feedback: feedback, // Create new feedback
      },
    });

    return review;
  } catch (error) {
    throw new Error("Error saving review responses: " + error.message);
  }
}*/



export async function saveReviewResponses(sprintId, itemId, responses = {}, feedback = "") {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    // Save the review responses and feedback to the database
    const review = await db.review.upsert({
      where: { itemId_sprintId: { itemId: itemId.toString(), sprintId } }, // Ensure itemId is a string
      update: {
        responses: responses, // Update the responses (can be empty)
        feedback: feedback, // Update the feedback (can be empty)
      },
      create: {
        sprintId: sprintId,
        itemId: itemId.toString(), // Ensure itemId is a string
        responses: responses, // Create new responses (can be empty)
        feedback: feedback, // Create new feedback (can be empty)
      },
    });

    return review;
  } catch (error) {
    throw new Error("Error saving review responses: " + error.message);
  }
}