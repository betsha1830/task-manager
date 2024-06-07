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

    // Simulate entering a task and adding it
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

    // Simulate adding a task
    fireEvent.change(taskInput, { target: { value: "Test Task" } })
    fireEvent.click(addButton)

    // Get the delete button for the task
    const deleteButton = screen.getByTitle("Delete task")

    // Simulate deleting the task
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
})
