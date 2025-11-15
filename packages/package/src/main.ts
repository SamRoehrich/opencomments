import "./style.css";
import { createWidget } from "./ui/widget.ts";
import { renderAllIssues } from "./lib/render-all-issues.ts";

createWidget();
(async () => await renderAllIssues())()