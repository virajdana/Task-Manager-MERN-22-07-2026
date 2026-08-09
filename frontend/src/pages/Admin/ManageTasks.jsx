import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import { toast } from "react-hot-toast";

import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  // =========================
  // GET ALL TASKS
  // =========================
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_ALL_TASKS,
        {
          params: {
            status:
              filterStatus === "All"
                ? ""
                : filterStatus,
          },
        }
      );

      console.log("TASK RESPONSE:", response.data);

      // Set tasks
      setAllTasks(
        response.data?.tasks?.length > 0
          ? response.data.tasks
          : []
      );

      // Status summary
      const statusSummary =
        response.data?.statusSummary || {};

      const statusArray = [
        {
          label: "All",
          count: statusSummary.all || 0,
        },
        {
          label: "Pending",
          count:
            statusSummary.pendingTasks || 0,
        },
        {
          label: "In Progress",
          count:
            statusSummary.inProgress || 0,
        },
        {
          label: "Completed",
          count:
            statusSummary.completed || 0,
        },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch tasks"
      );
    }
  };

  // =========================
  // HANDLE TASK CLICK
  // =========================
  const handleClick = (taskData) => {
    navigate("/admin/create-task", {
      state: {
        taskId:
          taskData._id ||
          taskData.id,
      },
    });
  };

  // =========================
  // DOWNLOAD TASK REPORT
  // =========================
  const handleDownloadReport = async () => {
    try {
      const response =
        await axiosInstance.get(
          API_PATHS.REPORTS.EXPORT_TASKS,
          {
            responseType: "blob",
          }
        );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "task_details.xlsx"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        "Task report downloaded successfully!"
      );
    } catch (error) {
      console.error(
        "Error downloading task report:",
        error
      );

      toast.error(
        "Failed to download task report."
      );
    }
  };

  // =========================
  // USE EFFECT
  // =========================
  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  // =========================
  // UI
  // =========================
  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Manage Tasks
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor all tasks
            </p>
          </div>

          {/* Download Report */}
          <button
            className="download-btn flex items-center gap-2"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />

            Download Report
          </button>
        </div>

        {/* Status Tabs */}
        {tabs?.length > 0 && (
          <div className="flex items-center gap-3 mt-5">
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          </div>
        )}

        {/* Task Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

          {allTasks?.length > 0 ? (
            allTasks.map((item) => (
              <TaskCard
                key={
                  item._id ||
                  item.id
                }

                title={item.title}

                description={
                  item.description
                }

                priority={
                  item.priority
                }

                status={
                  item.status
                }

                progress={
                  item.progress
                }

                createdAt={
                  item.createdAt
                }

                dueDate={
                  item.dueDate
                }

                assignedTo={
                  Array.isArray(item.assignedTo)
                    ? item.assignedTo.map(
                        (user) => user.profileImageUrl
                      )
                    : item.assignedTo?.profileImageUrl
                      ? [item.assignedTo.profileImageUrl]
                      : []
                }

                attachmentCount={
                  item.attachments
                    ?.length || 0
                }

                completedTodoCount={
                  item.completedTodoCount ||
                  0
                }

                todoChecklist={
                  item.todoChecklist ||
                  []
                }

                onClick={() =>
                  handleClick(item)
                }
              />
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center py-10">
              <p className="text-gray-500">
                No tasks found.
              </p>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;