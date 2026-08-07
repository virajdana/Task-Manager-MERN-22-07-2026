import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";

const TaskCard = ({
  title,
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
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

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

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-all px-4 py-4 border-l-[4px] ${
        status === "In Progress"
          ? "border-cyan-500"
          : status === "Completed"
          ? "border-lime-500"
          : "border-violet-500"
      }`}
    >
      {/* Status & Priority */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded ${getStatusTagColor()}`}
        >
          {status}
        </span>

        <span
          className={`text-xs font-medium px-2.5 py-1 rounded ${getPriorityTagColor()}`}
        >
          {priority}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-800 mt-4 line-clamp-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 mt-2 line-clamp-3">
        {description}
      </p>

      {/* Progress */}
      <div className="mt-4">
        <Progress progress={progress} />
      </div>

      {/* Todo */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-xs text-gray-500">
          {completedTodoCount}/{todoChecklist?.length || 0} Completed
        </p>

        <p className="text-xs text-gray-500">
          {progress}% Done
        </p>
      </div>

      {/* Due Date */}
      <div className="mt-4">
        <label className="text-xs text-gray-500">Due Date</label>
        <p className="text-sm font-medium text-gray-800">
          {moment(dueDate).format("Do MMM YYYY")}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5">
        <AvatarGroup avatars={assignedTo || []} />

        {attachmentCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
            <LuPaperclip className="text-primary" />
            <span className="text-xs text-gray-900">
              {attachmentCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;