import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { Review, Issue, Comment } from "@opencomments/types";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

/**
 * Upload a base64 image to S3 and return the URL
 */
export async function uploadScreenshotToS3(
  base64Image: string,
  issueId: number
): Promise<string | null> {
  try {
    if (!BUCKET_NAME) {
      console.error("AWS_S3_BUCKET_NAME environment variable is not set");
      return null;
    }

    // Convert base64 to buffer
    // Remove data URL prefix if present (e.g., "data:image/png;base64,")
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `screenshots/issue-${issueId}-${timestamp}.png`;
    const contentType = "image/png";

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read", // Make the image publicly accessible
    });

    await s3Client.send(command);

    // Construct the S3 URL
    const s3Url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${filename}`;
    
    return s3Url;
  } catch (error) {
    console.error("Failed to upload screenshot to S3:", error);
    return null;
  }
}

/**
 * Generate markdown report for a review with LLM-friendly instructions
 */
export function generateReviewMarkdown(
  review: Review,
  issues: Issue[],
  issuesWithComments: Array<{ issue: Issue; comments: Comment[] }>
): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`# Review: ${review.name}`);
  lines.push("");
  
  if (review.description) {
    lines.push(`## Overview`);
    lines.push("");
    lines.push(review.description);
    lines.push("");
  }
  
  lines.push(`**Review ID:** ${review.id}`);
  lines.push(`**Created:** ${new Date(review.created_at).toISOString()}`);
  lines.push(`**Created By:** ${review.user_id}`);
  if (review.env_id) {
    lines.push(`**Environment:** ${review.env_id}`);
  }
  lines.push("");
  
  // Summary
  lines.push(`## Summary`);
  lines.push("");
  lines.push(`This review contains **${issues.length} issue(s)** that need to be addressed.`);
  lines.push("");
  
  if (issues.length === 0) {
    lines.push("> ⚠️ No issues have been added to this review yet.");
    lines.push("");
    lines.push("Once issues are added to this review, they will appear here with detailed instructions for fixing them.");
    lines.push("");
    return lines.join("\n");
  }
  
  // Instructions for LLM
  lines.push(`## Instructions for AI Code Assistant`);
  lines.push("");
  lines.push("You are tasked with reviewing and fixing the issues listed below. For each issue:");
  lines.push("");
  lines.push("1. **Locate the element** using the provided selector and position information");
  lines.push("2. **Review the issue description** and any associated comments");
  lines.push("3. **Examine the screenshot** (if available) to understand the visual context");
  lines.push("4. **Make the necessary code changes** to fix the issue");
  lines.push("5. **Test your changes** to ensure they resolve the problem");
  lines.push("");
  lines.push("---");
  lines.push("");
  
  // Issues
  issues.forEach((issue, index) => {
    const issueComments = issuesWithComments.find(ic => ic.issue.id === issue.id)?.comments || [];
    
    lines.push(`## Issue ${index + 1}: ${issue.description || `Issue #${issue.id}`}`);
    lines.push("");
    
    // Issue metadata
    lines.push(`**Issue ID:** ${issue.id}`);
    lines.push(`**Status:** ${issue.resolved ? "✅ Resolved" : "❌ Open"}`);
    lines.push(`**Created:** ${new Date(issue.created_at).toISOString()}`);
    lines.push(`**Created By:** ${issue.user_id}`);
    if (issue.assigned_to_user_id) {
      lines.push(`**Assigned To:** ${issue.assigned_to_user_id}`);
    }
    if (issue.url) {
      lines.push(`**URL:** ${issue.url}`);
    }
    lines.push("");
    
    // Description
    if (issue.description) {
      lines.push(`### Description`);
      lines.push("");
      lines.push(issue.description);
      lines.push("");
    }
    
    // Element location
    lines.push(`### Element Location`);
    lines.push("");
    lines.push("**CSS Selector:**");
    lines.push("```css");
    lines.push(issue.selector.join(" > "));
    lines.push("```");
    lines.push("");
    lines.push("**Position Information:**");
    lines.push(`- Relative Position: (${issue.relative_x}, ${issue.relative_y})`);
    lines.push(`- Element Size: ${issue.element_width} × ${issue.element_height}px`);
    lines.push(`- Viewport Size: ${issue.viewport_width} × ${issue.viewport_height}px`);
    lines.push("");
    
    // Screenshot
    if (issue.screenshot) {
      lines.push(`### Screenshot`);
      lines.push("");
      lines.push("A screenshot is available for this issue. Use it to understand the visual context.");
      lines.push("");
      if (issue.screenshot.startsWith("http")) {
        lines.push(`![Issue Screenshot](${issue.screenshot})`);
      } else {
        lines.push("> Screenshot data is embedded in the issue (base64 encoded)");
      }
      lines.push("");
    }
    
    // Comments
    if (issueComments.length > 0) {
      lines.push(`### Comments & Discussion`);
      lines.push("");
      issueComments.forEach((comment, commentIndex) => {
        lines.push(`**Comment ${commentIndex + 1}** (by ${comment.user_id}, ${new Date(comment.created_at).toLocaleString()}):`);
        lines.push("");
        lines.push(comment.comment);
        lines.push("");
      });
    }
    
    // Action items
    lines.push(`### Action Items`);
    lines.push("");
    lines.push("1. Locate the element using the CSS selector and position information");
    lines.push("2. Review the issue description and comments above");
    if (issue.screenshot) {
      lines.push("3. Examine the screenshot to understand the visual context");
    }
    lines.push("4. Identify the root cause of the issue");
    lines.push("5. Implement the fix in the codebase");
    lines.push("6. Verify the fix resolves the issue");
    lines.push("");
    
    if (index < issues.length - 1) {
      lines.push("---");
      lines.push("");
    }
  });
  
  // Footer
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`*Report generated on ${new Date().toISOString()}*`);
  lines.push(`*Review ID: ${review.id}*`);
  
  return lines.join("\n");
}

/**
 * Upload a markdown review report to R2/S3
 */
export async function uploadReviewReportToS3(
  markdownContent: string,
  reviewId: number
): Promise<string | null> {
  try {
    if (!BUCKET_NAME) {
      console.error("AWS_S3_BUCKET_NAME environment variable is not set");
      return null;
    }

    // Convert markdown to buffer
    const buffer = Buffer.from(markdownContent, "utf-8");

    // Generate filename in review-reports folder
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `review-reports/review-${reviewId}-${timestamp}.md`;
    const contentType = "text/markdown";

    // Upload to S3/R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read", // Make the report publicly accessible
    });

    await s3Client.send(command);

    // Construct the S3 URL
    const s3Url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${filename}`;
    
    return s3Url;
  } catch (error) {
    console.error("Failed to upload review report to S3:", error);
    return null;
  }
}

