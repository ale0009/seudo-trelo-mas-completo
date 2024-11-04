import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { Task } from '@/lib/types';

// Tareas de ejemplo para el desarrollador
const MOCK_DEV_TASKS: Task[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Implementar autenticación',
    description: 'Configurar JWT y manejo de sesiones',
    status: 'todo',
    assigneeId: '3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    projectId: '2',
    title: 'Diseñar API REST',
    description: 'Crear endpoints para el módulo de usuarios',
    status: 'in_progress',
    assigneeId: '3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function DevBoardPage() {
  const { user } = useAuth();
  const [misTareas, setMisTareas] = useState<Task[]>([]);

  useEffect(() => {
    // Aquí simularemos obtener las tareas del desarrollador actual
    const tareasDesarrollador = MOCK_DEV_TASKS.filter(
      (task) => task.assigneeId === user?.id
    );
    setMisTareas(tareasDesarrollador);
  }, [user?.id]);

  const columnas = {
    todo: {
      titulo: 'Por Hacer',
      tareas: misTareas.filter((tarea) => tarea.status === 'todo'),
    },
    in_progress: {
      titulo: 'En Progreso',
      tareas: misTareas.filter((tarea) => tarea.status === 'in_progress'),
    },
    done: {
      titulo: 'Completado',
      tareas: misTareas.filter((tarea) => tarea.status === 'done'),
    },
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(misTareas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    reorderedItem.status = result.destination.droppableId as Task['status'];
    items.splice(result.destination.index, 0, reorderedItem);

    setMisTareas(items);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Tablero</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user?.name}
        </p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Object.entries(columnas).map(([columnId, columna]) => (
            <div key={columnId} className="rounded-lg border bg-card p-4">
              <h3 className="mb-4 font-semibold">{columna.titulo}</h3>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {columna.tareas.map((tarea, index) => (
                      <Draggable
                        key={tarea.id}
                        draggableId={tarea.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="rounded-lg border bg-background p-4"
                          >
                            <h4 className="font-medium">{tarea.title}</h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {tarea.description}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}