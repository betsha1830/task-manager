"use client"

import { useEffect, useState } from "react"
import { ChangeEvent } from "react"

export default function Home() {
  const [id, setId] = useState(0) //  Used to track the list as an order list
  const initialTask = [{ id: id, task: "", completed: false }] //  Used for data type mapping
  const [output, setOutput] = useState(initialTask) //  Used to manipulate the original data for filtering and outputting
  const [storage, setStorage] = useState(initialTask) //  Original data that will be store in local storage
  const [currentInput, setCurrentInput] = useState("") //  Used to fetch the input data from user

  // Checks if there is any saved local data
  useEffect(() => {
    const temp = localStorage.getItem("storage") //	Fetches item from local storage
    if (temp === null || temp.length === 0) {
      //	Checks if local storage is empty. If empty increases id by 1 else assigns the value to storage and output state
      setId(id + 1)
      return
    }
    let arr = JSON.parse(temp)
    setStorage(arr)
    setOutput(arr)
    setId(arr.length)
  }, [])

  //  Adds a task to the list
  function addTask() {
    setId(id + 1)
    const i = [...storage, { id: id, task: currentInput, completed: false }]
    setStorage(i)
    setOutput(i)
    localStorage.setItem("storage", JSON.stringify(i))
    const taskInput = document.getElementById("task-input") as HTMLInputElement
    taskInput.value = ""
  }

  //  Listens to text input change
  function listenChange(e: ChangeEvent<HTMLInputElement>) {
    setCurrentInput(e.target.value)
  }

  //  Changes the tasks status as completed or active
  function isCompleted(isChecked: boolean, id: number) {
    const temp = [{ id: 0, task: "", completed: false }]
    storage.map((c, i) => {
      if (i === 0) return // Remove the inital task that was used for data type mapping
      if (c.id === id) {
        temp.push({ id: id, task: c.task, completed: !c.completed })
      } else {
        return temp.push(c)
      }
    })
    setStorage(temp)
    setOutput(temp)
    localStorage.setItem("storage", JSON.stringify(temp))
  }

  //	Deletes a task
  function deleteTask(id: number) {
    let temp = storage.slice(0, id)
    storage.map((i) => {
      if (i.id <= id) return
      temp.push({ id: i.id - 1, task: i.task, completed: i.completed })
    })
    setId(temp.length)
    setStorage(temp)
    setOutput(temp)
    localStorage.setItem("storage", JSON.stringify(temp))
  }

  //	Filters tasks based on its status
  function filterTasks(filter: string) {
    let temp = [{ id: 0, task: "", completed: false }]
    if (filter === "completed") {
      //	Filters tasks that are completed
      storage.map((i) => {
        if (i.completed === true) {
          temp.push({ id: i.id, task: i.task, completed: i.completed })
        }
      })
    } else if (filter === "active") {
      //	Filters tasks that are still active
      storage.map((i) => {
        if (i.completed === false) {
          temp.push({ id: i.id, task: i.task, completed: i.completed })
        }
      })
    } else {
      //	Lists all tasks
      temp = storage
    }
    setOutput(temp)
  }

  return (
    <div className="parent-container text-lg flex flex-col items-center gap-y-4">
      <div>
        <h1 className="text-4xl font-bold">Todist</h1>
      </div>
      <div className="add-task flex justify-center lg:justify-start gap-x-4 flex-wrap gap-y-4">
        <input
          placeholder="Get some milk"
          onChange={(e) => listenChange(e)}
          className="rounded-md h-10 px-2"
          type="text"
          id="task-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask()
            }
          }}
        />
        <button className="bg-white rounded-md px-2 min-h-10" onClick={addTask}>
          Add task
        </button>
      </div>
      <div className="filter flex gap-x-4 flex-wrap">
        Filter:{" "}
        <select
          onChange={(e) => filterTasks(e.target.value)}
          size={1}
          className="px-3 rounded h-10"
        >
          <option value="">Choose an option</option>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </div>
      <div className="border-2 min-w-64 max-w-96 py-2 px-4">
        {output.map((c, i) => {
          if (c.id === 0) return // Remove the inital task that was used for data type mapping
          return (
            <div className="flex items-center" key={c.id}>
              <input
                className="w-5 h-5"
                type="checkbox"
                onChange={(e) => {
                  isCompleted(e.target.checked, c.id)
                }}
                checked={c.completed}
              />{" "}
              &nbsp;&nbsp;
              <div className="flex w-full justify-between">
                <div
                  className={
                    c.completed
                      ? "line-through text-gray-400 mx-1  mb-2"
                      : "text-black mx-1 mb-2"
                  }
                >
                  {c.id}. {c.task}{" "}
                </div>{" "}
                <button title="Delete task" onClick={() => deleteTask(c.id)}>
                  🗑️
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
