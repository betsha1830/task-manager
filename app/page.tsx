"use client"

import { useState } from "react"
import { ChangeEvent } from "react"

export default function Home() {
  const [id, setId] = useState(1)
  const initialTask = [{ id: id, task: "", completed: false }]

  const [event, setEvent] = useState(true)
  const [storage, setStorage] = useState(initialTask)
  const [currentInput, setCurrentInput] = useState("")

  //  Adds a task to the list
  function addTask() {
    setId(id + 1)
    setStorage([...storage, { id: id, task: currentInput, completed: false }])
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
      <div>
        {storage.map((c, i) => {
          if (i === 0) return // Remove the inital task that was used for data type mapping
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
              <br />
            </div>
          )
        })}
      </div>
    </div>
  )
}
