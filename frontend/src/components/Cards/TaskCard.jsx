import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";


const TaskCard = (
{  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick}
) => {

  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

        case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";

        default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";

        const getPriorityTagColor = () => {
        switch (priority) {
            case "Low":
            return "text-green-500 bg-green-50 border border-green-500/10";
            case "Medium":
            return "text-yellow-500 bg-yellow-50 border border-yellow-500/10";
            default:
            return "text-red-500 bg-red-50 border border-red-500/10";
        }
        };

        return <div>TaskCard</div>;

export default TaskCard;

