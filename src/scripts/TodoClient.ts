import type { Zero } from "@rocicorp/zero";
import type { Schema } from "../schema";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

declare global {
  interface Window {
    __ZERO_CLIENT__: Zero<Schema>;
  }
}

export function initTodoList() {
  const zero = window.__ZERO_CLIENT__;
  const todoList = document.querySelector("#todo-list ul");
  const input = document.querySelector("#new-todo") as HTMLInputElement;
  const button = document.querySelector("#add-todo");
  const container = document.querySelector("#todo-list");

  function createTodoElement(todo: Todo): string {
    return `
      <li data-id="${todo.id}">
        <input type="checkbox" ${todo.completed ? "checked" : ""}>
        <span>${todo.title}</span>
      </li>
    `;
  }

  async function renderTodos(todos: readonly Todo[]) {
    if (!todoList) return;
    todoList.innerHTML = todos.map(createTodoElement).join("");
  }

  // Create observer for Zero client
  // const checkForZero = setInterval(async () => {
  //   const zero = window.__ZERO_CLIENT__;
  //   if (zero) {
  //     clearInterval(checkForZero);
  //     console.log("Zero client initialized:", zero);

  //     // Poll for changes
  //     async function pollForChanges() {
  //       const todos = zero.query.todo.materialize().data;
  //       renderTodos(todos);
  //       setTimeout(pollForChanges, 1000);
  //     }

  //     // Initial render
  //     const initialTodos = zero.query.todo.materialize().data;
  //     await renderTodos(initialTodos);
  //     pollForChanges();
  //   }
  // }, 100);

  // Add handlers for todo interactions
  todoList?.addEventListener("change", async (e) => {
    const target = e.target as HTMLInputElement;
    if (target.type === "checkbox") {
      const li = target.closest("li");
      const id = li?.dataset.id;
      if (id) {
        const zero = window.__ZERO_CLIENT__;
        await zero?.mutate.todo.update({ id, completed: target.checked });
      }
    }
  });

  button?.addEventListener("click", async () => {
    const zero = window.__ZERO_CLIENT__;
    if (!zero || !input?.value) return;

    await zero.mutate.todo.insert({
      id: crypto.randomUUID(),
      title: input.value,
      completed: false,
    });
    input.value = "";
  });

  // async function doListLoad() {
  //   const zero = window.__ZERO_CLIENT__;
  //   if (!zero) return;
  //   const initialTodos = zero.query.todo.materialize().data;
  //   await renderTodos(initialTodos);
  //   console.log(initialTodos);
  //   zero.subscribe("todo", async (todos: readonly Todo[]) => {
  //     // console.log("todo changed", todos);
  //     await renderTodos(todos);
  //   });
  // }
  // doListLoad();
  async function doListLoad() {
    if (!zero) return;
    const initialTodos = zero.query.todo.materialize().data;
    await renderTodos(initialTodos);
    console.log(initialTodos);
  }

  zero.subscribe("todo", async (todos: readonly Todo[]) => {
    console.log("todo changed", todos);
    await renderTodos(todos);
    zero.unsubscribe();
  });
}
