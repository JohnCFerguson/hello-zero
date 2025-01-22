import { QueryView } from "zero-astro";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export async function initTodoList() {
  const zero = window.__ZERO_CLIENT__;
  const todoList = document.querySelector("#todo-list ul");
  const input = document.querySelector("#new-todo") as HTMLInputElement;
  const button = document.querySelector("#add-todo");

  if (!zero) {
    console.error("Zero client not initialized");
    return;
  }

  // Create QueryView for todos
  const view = zero.query.todo.materialize();
  const queryView = new QueryView(view);
  console.log({ queryView });

  // Set up subscription using addListener
  const unsubscribe = queryView.addListener(
    async (data: readonly { [x: string]: any }[], resultType: string) => {
      console.log({ resultType, data });
      if (resultType === "complete" && Array.isArray(data)) {
        // Type assertion to Todo[] after confirming it's an array
        await renderTodos(data as Todo[]);
      }
    }
  );

  // Cleanup on page unload
  window.addEventListener("unload", () => {
    unsubscribe();
    queryView.destroy();
  });

  todoList?.addEventListener("change", async (e) => {
    const target = e.target as HTMLInputElement;
    if (target.type === "checkbox") {
      const li = target.closest("li");
      const id = li?.dataset.id;
      if (id) {
        await zero.mutate.todo.update({
          id,
          completed: target.checked,
        });
      }
    }
  });

  button?.addEventListener("click", async () => {
    if (!input?.value) return;

    await zero.mutate.todo.insert({
      id: crypto.randomUUID(),
      title: input.value,
      completed: false,
    });
    input.value = "";
  });

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
}
