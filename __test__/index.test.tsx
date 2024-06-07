import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import Home from "@/app/page"
import "@testing-library/jest-dom"

describe("Home component", () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  //  Tests addTask function to add task in state and local storage
  test("addTask function should add a task to state and local storage", () => {
    render(<Home />)

    const taskInput = screen.getByRole("textbox")
    const addButton = screen.getByText("Add task")

    fireEvent.change(taskInput, { target: { value: "Test task" } })
    fireEvent.click(addButton)

    // Check that task was added to the document
    const newTask = screen.getByText("1. Test task")
    expect(newTask).toBeInTheDocument()

    // Check localStorage
    const storage = JSON.parse(localStorage.getItem("storage")!)
    expect(storage).toEqual(
      //  Should contain the newly added task
      expect.arrayContaining([
        expect.objectContaining({ id: 1, task: "Test task", completed: false }),
      ])
    )
  })

  //  Tests deleteTask function to delete task in state and local storage
  test("deleteTask function should remove a task from state and local storage", () => {
    render(<Home />)

    const taskInput = screen.getByRole("textbox")
    const addButton = screen.getByText("Add task")

    fireEvent.change(taskInput, { target: { value: "Test Task" } })
    fireEvent.click(addButton)

    const deleteButton = screen.getByTitle("Delete task")

    fireEvent.click(deleteButton)

    // Check that task was removed from the document
    const newTask = screen.queryByText("1. Test Task")
    expect(newTask).not.toBeInTheDocument()

    // Check localStorage
    const storage = JSON.parse(localStorage.getItem("storage")!)
    expect(storage).toEqual([
      //  Should not contain the newly added task.
      {
        completed: false,
        id: 0,
        task: "",
      },
    ])
  })

  //  Tests filterTasks function to filter task if completed, active or all
  test("filterTasks function should filter tasks based on their status", () => {
    localStorage.setItem(
      "storage",
      JSON.stringify([
        { id: 1, task: "Active Task", completed: false },
        { id: 2, task: "Completed Task", completed: true },
      ])
    )
    render(<Home />)

    const filterSelect = screen.getByTitle("select filter")

    // Filter completed tasks
    fireEvent.change(filterSelect, { target: { value: "completed" } })
    expect(screen.queryByText("1. Active Task")).not.toBeInTheDocument()
    expect(screen.queryByText("2. Completed Task")).toBeInTheDocument()

    // Filter active tasks
    fireEvent.change(filterSelect, { target: { value: "active" } })
    expect(screen.queryByText("1. Active Task")).toBeInTheDocument()
    expect(screen.queryByText("2. Completed Task")).not.toBeInTheDocument()

    // Show all tasks
    fireEvent.change(filterSelect, { target: { value: "all" } })
    expect(screen.queryByText("1. Active Task")).toBeInTheDocument()
    expect(screen.queryByText("2. Completed Task")).toBeInTheDocument()
  })
})
