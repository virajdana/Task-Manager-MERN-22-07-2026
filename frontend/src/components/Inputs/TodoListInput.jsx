import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  // Add task
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  // Delete task
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div>
      {/* Todo List */}
      {todoList.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3"
        >
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-slate-700">
              {index < 9 ? `0${index + 1}` : index + 1}
            </p>

            <p className="text-sm text-slate-700">{item}</p>
          </div>

          <button
            type="button"
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      {/* Add Todo */}
      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={(e) => setOption(e.target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded"
        />

        <button
          type="button"
          className="card-btn flex items-center gap-1"
          onClick={handleAddOption}
        >
          <HiMiniPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;