import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AvatarGroup from "../../components/AvatarGroup";
import moment from "moment";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  // Get Task by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  // Update Todo Checklist
  const updateTodoChecklist = async (index) => {
    if (!task) return;

    const updatedChecklist = [...task.todoChecklist];

    updatedChecklist[index] = {
      ...updatedChecklist[index],
      completed: !updatedChecklist[index].completed,
    };

    // Update UI instantly
    setTask({
      ...task,
      todoChecklist: updatedChecklist,
    });

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        {
          todoChecklist: updatedChecklist,
        }
      );

      if (response.data?.task) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.error(error);
      getTaskDetailsByID();
    }
  };

  // Attachment click
  const handleLinkClick = (link) => {
    let url = link;

    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-medium">
                  {task.title}
                </h2>

                <div
                  className={`text-[11px] md:text-[13px] font-medium px-4 py-1 rounded ${getStatusTagColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox
                  label="Description"
                  value={task.description}
                />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Priority"
                    value={task.priority}
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task.dueDate
                        ? moment(task.dueDate).format("Do MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>

                <div className="col-span-12 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>

                  <AvatarGroup
                    avatars={
                      task.assignedTo
                        ?.filter((user) => user?.profileImageUrl)
                        .map((user) => user.profileImageUrl) || []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>

                <div className="mt-2">
                  {task.todoChecklist?.map((item, index) => (
                    <TodoCheckList
                      key={index}
                      text={item.text}
                      isChecked={item.completed}
                      onChange={() =>
                        updateTodoChecklist(index)
                      }
                    />
                  ))}
                </div>
              </div>

              {task.attachments?.length > 0 && (
                <div className="mt-5">
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>

                  <div className="mt-2">
                    {task.attachments.map((link, index) => (
                      <Attachment
                        key={index}
                        index={index}
                        link={link}
                        onClick={() =>
                          handleLinkClick(link)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">
        {label}
      </label>

      <p className="text-[13px] font-medium text-gray-700 mt-1">
        {value || "N/A"}
      </p>
    </>
  );
};

const TodoCheckList = ({
  text,
  isChecked,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <input
        type="checkbox"
        checked={!!isChecked}
        onChange={onChange}
        className="w-4 h-4 cursor-pointer"
      />

      <p
        className={`text-[13px] ${
          isChecked
            ? "line-through text-gray-400"
            : "text-gray-800"
        }`}
      >
        {text}
      </p>
    </div>
  );
};

const Attachment = ({
  link,
  index,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mt-2 cursor-pointer hover:bg-gray-100 transition"
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="text-xs text-gray-400 font-semibold">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>

        <p className="text-xs text-black truncate">
          {link}
        </p>
      </div>

      <LuSquareArrowOutUpRight className="text-gray-500 text-lg" />
    </div>
  );
};