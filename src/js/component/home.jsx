import React, { useState, useEffect } from "react";
import ListItem from "./listItem";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]); // Lista de tareas

  const API_URL = "https://playground.4geeks.com/todo/users/AlvaroRG"; // Cambia por la URL de tu API

  // Cargar tareas iniciales desde la API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.status.toString() === "404"){
          throw new Error("El usuario no existe");
        }
        const data = await response.json();
        // Extrae las tareas de la propiedad 'todos'
        if (data.todos && Array.isArray(data.todos)) {
          setItems(data.todos);
        } else {
          console.error("Formato inesperado en la respuesta:", data);
          setItems([]);
        }
        console.log(data);
      } catch (error) {
        console.error(error);
        setItems([]); // En caso de error, la lista se queda vacía
      }
    };

    fetchTasks();
  }, []);

  // Agregar una tarea
  const keyDown = async (e) => {
	if (e.key === "Enter" && inputValue.trim() !== "") {
	  try {
		const newTask = { label: inputValue.trim(), is_done: false };
		console.log(newTask);
		const response = await fetch("https://playground.4geeks.com/todo/todos/AlvaroRG", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify(newTask),
		});
  
		if (!response.ok) throw new Error("Error al agregar la tarea");
  
		const updatedResponse = await fetch(API_URL);
    if (!updatedResponse.ok) throw new Error("Error al obtener tareas actualizadas");

    const updatedData = await updatedResponse.json();

    // Validar y actualizar el estado de `items`
    if (Array.isArray(updatedData.todos)) {
      setItems(updatedData.todos);
      setInputValue(""); // Limpiar el input después de agregar la tarea
    } else {
      console.error("Formato inesperado al actualizar la lista:", updatedData);
    }
	  } catch (error) {
		console.error(error);
	  }
	}
  };

  // Eliminar una tarea
  const removeItem = async (id) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, { method: "DELETE" });
	  console.log(response);

        // Si la API devuelve un estado 204 (No Content), no intentes parsear el cuerpo.
		if (response.ok) {
			const updatedData = await fetch(API_URL);
			if (!updatedData.ok) throw new Error("Error al obtener tareas actualizadas");
	  
			const data = await updatedData.json();
	  
			// Asegurarse de que `todos` es un array
			if (Array.isArray(data.todos)) {
			  setItems(data.todos);
			} else {
			  console.error("Formato inesperado al actualizar la lista:", data);
			}
		  } else {
			console.error("Error al eliminar la tarea:", response.statusText);
		  }
		} catch (error) {
		  console.error("Error al eliminar la tarea:", error);
		}
	  };

  return (
    <div className="text-center">
      <div className="titulo display-1">todos</div>
      <div className="d-flex pila mt-5">
        <div className="papel">
          <input
            type="text"
            className="form-control border-0 shadow-none mt-3"
            placeholder="Escribe algo y presiona Enter"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={keyDown}
          />
          <hr className="hr hr-blurry" />
          <ul className="list-group border-0">
            {items.map((item) => (
              <ListItem
                key={item.id}
                text={item.label}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </ul>
          <div className="text-secondary d-flex justify-content-start">
            <p className="ps-3 num-tareas">{items.length} item left</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
