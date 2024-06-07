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
})
