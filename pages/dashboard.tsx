"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import AfterLoginHeader from "./components/headers/afterLogin";

import Loading from "./components/loading/loading";

interface Task {
  task_id: string;
  task_name: string;
  created_date?: { _seconds: number };
  task_description: string;
  done: boolean;
  due_date?: string;
}

const Dashboard = () => {
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>([]); // State for tasks
  const router = useRouter();

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("User:", user);
      if (!user) {
        router.push("/login"); // Redirect to login page if not logged in
      } else {
        setUser(user); // Set user data if logged in
        await fetchTasks(user.email, user.uid); // Fetch tasks from the backend
        localStorage.setItem("user", JSON.stringify(user)); // Store user data in localStorage
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener
  }, [router]);

  // Fetch tasks from the backend
  const fetchTasks = async (email: string | null, uid: string) => {
    try {
      const response = await fetch('https://app-jttkc6k2ua-uc.a.run.app/api/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, uid }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      console.log('Dashboard data:', data);
      if (data && data.data && Array.isArray(data.data.tasks)) {
        setTasks(data.data.tasks); // Set the tasks state with the fetched data
      } else {
        console.error("Tasks data is not in the expected format");
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <AfterLoginHeader />
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">タスク一覧</p>
          </div>

          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div key={index} className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                <div className="flex flex-col justify-center">
                  <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">{task.task_name}</p>
                  <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">
                    {task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString()}` : 'No date available'}
                  </p>
                  <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">{task.task_description}</p>
                  <span className={`ml-2 text-sm ${task.done ? 'text-green-500' : 'text-red-500'}`}>
                    {task.done ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const { ...taskWithoutEmail } = task;
                      window.location.href = `/create-task?task=${encodeURIComponent(JSON.stringify({ ...taskWithoutEmail, edit: true }))}`;
                    }}
                    className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`https://app-jttkc6k2ua-uc.a.run.app/api/delete-task/${task.task_id}`, {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });

                        if (response.ok) {
                          // Filter out the deleted task from the tasks array
                          const updatedTasks = tasks.filter((_, i) => i !== index);
                          setTasks(updatedTasks);
                          alert('Task deleted successfully');
                        } else {
                          const errorData = await response.json();
                          alert(`Failed to delete task: ${errorData.error || 'Unknown error'}`);
                        }
                      } catch (error) {
                        console.error('Error deleting task:', error);
                        alert('An error occurred while deleting the task');
                      }
                    }}
                    className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm"
                  >
                    Delete
                  </button>
                  <div className="shrink-0">
                    <div className="flex size-7 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={async () => {
                          const updatedTasks = tasks.map((t, i) =>
                            i === index ? { ...t, done: !t.done } : t
                          );
                          setTasks(updatedTasks);

                          try {
                            const response = await fetch(`https://app-jttkc6k2ua-uc.a.run.app/api/edit-task/${task.task_id}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ done: !task.done }),
                            });

                            if (!response.ok) {
                              const errorData = await response.json();
                              alert(`Failed to update task: ${errorData.error || 'Unknown error'}`);
                            }
                          } catch (error) {
                            console.error('Error updating task:', error);
                            alert('An error occurred while updating the task');
                          }
                        }}
                        className="h-5 w-5 rounded border-[#dce0e5] border-2 bg-transparent text-[#2d86e6] checked:bg-[#2d86e6] checked:border-[#2d86e6] focus:ring-0 focus:ring-offset-0 focus:border-[#dce0e5] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No tasks available</div>
          )}

          <div className="flex px-4 py-3">
            <button
              onClick={() => router.push(`/create-task`)}
              className="bg-green-500 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Add task
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;