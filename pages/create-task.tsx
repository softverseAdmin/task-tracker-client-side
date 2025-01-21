// CreateTask.tsx
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import AfterLogin from './components/headers/afterLogin';
import Loading from "./components/loading/loading";

const CreateTask: React.FC = () => {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [taskId, setTaskId] = useState('');

  const router = useRouter();

  // On component mount, check if task is being edited
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskParam = urlParams.get('task');

    if (taskParam) {
      try {
        const taskData = JSON.parse(decodeURIComponent(taskParam));
        if (taskData?.task_id) {
          setTaskId(taskData.task_id);
          setTaskName(taskData.task_name || '');
          setDueDate(taskData.due_date || '');
          setTaskDescription(taskData.task_description || '');
          setIsEdit(true);
        }
      } catch (error) {
        console.error('Error parsing task data:', error);
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Retrieve user data from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) throw new Error('User not authenticated');

      const user = JSON.parse(storedUser); // Parse the stored user data
      const userId = user?.uid; // Get the user ID from the stored user data

      if (!userId) throw new Error('User ID not found in localStorage');

      const url = isEdit
        ? `https://app-jttkc6k2ua-uc.a.run.app/api/edit-task/${taskId}`
        : 'https://app-jttkc6k2ua-uc.a.run.app/api/create-task';

      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: taskId,
          taskName: taskName,
          dueDate: dueDate,
          taskDescription: taskDescription,
          userId: userId, // Pass the user ID from localStorage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || (isEdit ? 'Failed to edit task.' : 'Failed to create task.'));
      }
      setSuccessMessage(isEdit ? 'Task updated successfully!' : 'Task created successfully!');
      router.push('/dashboard'); // Redirect to dashboard after success
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error handling task:', error.message);
      } else {
        console.error('Error handling task:', error);
      }
      setErrorMessage((error as Error).message || 'An error occurred while processing the task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <AfterLogin />
    <div className="layout-container flex h-full grow flex-col">
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-[512px] py-5 flex-1">
          <h3 className="text-[#111418] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">
            {isEdit ? 'タスク編集' : 'タスク作成'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">タスク名</p>
                <input
                  placeholder="Example: Design task details"
                  className="form-input flex w-full rounded-xl text-[#111418] bg-[#f0f2f4] h-14 p-4"
                  name="taskName"
                  value={taskName}
                  required
                  onChange={(e) => setTaskName(e.target.value)}
                />
                <p className="mt-1 text-sm text-[#4F7396]">タスク名を入力してください</p>
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">締切日</p>
                <input
                  type="date"
                  className="form-input flex w-full rounded-xl text-[#111418] bg-[#f0f2f4] h-14 p-4"
                  name="dueDate"
                  value={dueDate}
                  required
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <p className="mt-1 text-sm text-[#4F7396]">締切日を入力してください</p>
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">タスクの説明</p>
                <textarea
                  placeholder="Example: Detailed task description"
                  className="form-input flex w-full rounded-xl text-[#111418] bg-[#f0f2f4] h-14 p-4"
                  name="taskDescription"
                  value={taskDescription}
                  required
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
                <p className="mt-1 text-sm text-[#4F7396]">タスクの説明を入力してください</p>
              </label>
            </div>
            <div className="flex px-4 py-3 justify-start">
              <button
                type="submit"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#2d86e6] text-white text-sm font-bold"
                disabled={loading}
              >
                {loading ? <Loading /> : isEdit ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex items-center justify-center rounded-xl px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold ml-4 min-w-[84px] max-w-[480px]"
              >
                Back
              </button>
            </div>
          </form>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-3 px-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm mt-3 px-4">{successMessage}</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CreateTask;