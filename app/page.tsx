"use client"

import { useEffect, useState } from "react"
import { ChangeEvent } from "react"

export default function Home() {
  const [id, setId] = useState(0)
  const initialTask = [{ id: id, task: "", completed: false }]

  const [output, setOutput] = useState(initialTask)
  const [storage, setStorage] = useState(initialTask)
  const [currentInput, setCurrentInput] = useState("")

  // Checks if there is any saved local data
  useEffect(() => {
    const temp = localStorage.getItem("storage") //	Fetches item from local storage
    if (temp === null) {
      //	Checks if local storage is empty. If empty increases id by 1 else assigns the value to storage and output state
      setId(id + 1)
      return
    }
    let arr = JSON.parse(temp)
    setStorage(arr)
    setOutput(arr)
    arr.map((i) => {
      setId(i.id + 1)
    })
  }, [])

  //  Adds a task to the list
  function addTask() {
    setId(id + 1)
    const i = [...storage, { id: id, task: currentInput, completed: false }]
    setStorage(i)
    setOutput(i)
    localStorage.setItem("storage", JSON.stringify(i))
  }

  //  Listens to text input change
  function listenChange(e: ChangeEvent<HTMLInputElement>) {
    setCurrentInput(e.target.value)
  }

  //  Changes the tasks status as completed or active
  function changeStatus(id: number) {
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
      setId(i.id) //	Assigns a new id value for an order list
      temp.push({ id: i.id - 1, task: i.task, completed: i.completed })
    })
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
      setOutput(temp)
    } else if (filter === "active") {
      //	Filters tasks that are still active
      storage.map((i) => {
        if (i.completed === false) {
          temp.push({ id: i.id, task: i.task, completed: i.completed })
        }
      })
      setOutput(temp)
    } else if (filter === "all") {
      //	Lists all tasks
      setOutput(storage)
    }
  }

  return (
    <div className="parent-container">
      <input
        onChange={(e) => listenChange(e)}
        className="border-2 border-solid border-gray-400"
        type="text"
      />
      <button className="border-2 border-black p-2" onClick={addTask}>
        Add task
      </button>
      Filter:{" "}
      <select className=" w-48">
        <option value="">Choose an option</option>
        <option onClick={() => filterTasks("all")} value={"all"}>
          All
        </option>
        <option onClick={() => filterTasks("completed")} value="completed">
          Completed
        </option>
        <option onClick={() => filterTasks("active")} value="active">
          Active
        </option>
      </select>
      <div>
        {output.map((c, i) => {
          if (c.id === 0) return // Remove the inital task that was used for data type mapping
          return (
            <div key={c.id}>
              {c.id}. {c.task}{" "}
              <button
                onClick={(e) => changeStatus(c.id)}
                title={
                  c.completed === false ? "Mark as completed" : "Mark as active"
                }
              >
                {" "}
                {c.completed === false ? "❌" : "✔️"}
              </button>{" "}
              <button title="Delete task" onClick={() => deleteTask(c.id)}>
                🗑️
              </button>
              <br />
            </div>
          )
        })}
      </div>
    </div>
  )
}
