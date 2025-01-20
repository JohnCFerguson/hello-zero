import { QueryView } from "zero-astro";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export function initTodoList() {
  const zero = window.__ZERO_CLIENT__;
  const todoList = document.querySelector("#todo-list ul");
  const input = document.querySelector("#new-todo") as HTMLInputElement;
  const button = document.querySelector("#add-todo");

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

  const queryView = new QueryView(zero?.query.todos);

  const unsubscribe = queryView.addEventListener((data) => {
    console.log("Todo data updated: ", data)
  })

  await zero?.mutate.todo.insert({
    
  })
}
