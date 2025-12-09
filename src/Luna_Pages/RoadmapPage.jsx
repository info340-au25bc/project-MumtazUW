import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ref, onValue, update, remove } from "firebase/database";
import { db } from "../main";
import "../css/roadmap.css";

const ItemTypes = { TASK: "task" };

const DraggableTask = ({ task, taskKey, phaseKey, moveTask, openEditModal }) => {
  const [, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { taskKey, phaseKey },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item) {
      if (item.phaseKey === phaseKey && item.taskKey !== taskKey) {
        moveTask(phaseKey, item.taskKey, taskKey);
        item.taskKey = taskKey;
      }
    },
  });

  const start = Number(task.start) || 0;
  const duration = Number(task.duration) || 1;

  return (
    <div className="task-row">
      <div
        ref={(node) => drag(drop(node))}
        className={`task-bar ${task.color}`}
        style={{
          left: `${(start / 12) * 100}%`,
          width: `${(duration / 12) * 100}%`,
          cursor: "grab",
        }}
        onClick={() => openEditModal(task, phaseKey, taskKey)}
      >
        {task.text}
      </div>
    </div>
  );
};

const RoadmapPage = () => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [phases, setPhases] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [editingPhaseKey, setEditingPhaseKey] = useState(null);
  const [editingTaskKey, setEditingTaskKey] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const phasesRef = ref(db, "roadmap/phases");
    return onValue(phasesRef, (snapshot) => {
      setPhases(snapshot.val() || {});
    });
  }, []);

  const moveTask = (phaseKey, fromKey, toKey) => {
    const phase = phases[phaseKey];
    const tasksArray = phase.tasks
      ? Object.entries(phase.tasks).sort(([, a], [, b]) => Number(a.start) - Number(b.start))
      : [];

    const fromIndex = tasksArray.findIndex(([key]) => key === fromKey);
    const toIndex = tasksArray.findIndex(([key]) => key === toKey);
    const [moved] = tasksArray.splice(fromIndex, 1);
    tasksArray.splice(toIndex, 0, moved);

    const newTasks = Object.fromEntries(tasksArray);
    update(ref(db, `roadmap/phases/${phaseKey}`), { tasks: newTasks });
  };

  const addTask = useCallback((phaseKey) => {
    const newTask = {
      text: "New Task",
      start: 1,
      duration: 1,
      color: phases[phaseKey].color,
    };
    const newKey = `task${Date.now()}`;
    update(ref(db, `roadmap/phases/${phaseKey}/tasks/${newKey}`), newTask);
  }, [phases]);

  const openEditModal = (task, phaseKey, taskKey) => {
    setEditingTask({ ...task });
    setEditingPhaseKey(phaseKey);
    setEditingTaskKey(taskKey);
    setShowModal(true);
  };

  const saveTaskChanges = () => {
    update(
      ref(db, `roadmap/phases/${editingPhaseKey}/tasks/${editingTaskKey}`),
      editingTask
    );
    setShowModal(false);
  };

  const deleteTask = () => {
    remove(ref(db, `roadmap/phases/${editingPhaseKey}/tasks/${editingTaskKey}`));
    setShowModal(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="roadmap-wrapper">
        <header className="header">
          <h1>Product Roadmap</h1>
        </header>

        <aside className="sidebar">
          <h2>Navigation</h2>
          <nav>
            <ul>
              <li><NavLink to="/overview">Project Overview</NavLink></li>
              <li><NavLink to="/projects">Projects</NavLink></li>
              <li><NavLink to="/roadmap" className="active">Roadmap</NavLink></li>
              <li><NavLink to="/backlog">Tasks and Backlog</NavLink></li>
              <li><NavLink to="/notifications">Notifications</NavLink></li>
            </ul>
          </nav>
        </aside>

        <main className="roadmap-main">
          <div className="roadmap-content">
            <div className="roadmap-header">
              <div className="phase-label-spacer" />
              <div className="months-container">
                {months.map((month, idx) => (
                  <div key={idx} className="month-cell">{month}</div>
                ))}
              </div>
            </div>

            {Object.entries(phases).map(([phaseKey, phase]) => {
              const tasksArray = phase.tasks
                ? Object.entries(phase.tasks).sort(([, a], [, b]) => Number(a.start) - Number(b.start))
                : [];

              return (
                <div key={phaseKey} className="phase-row">
                  <div className="phase-label-container">
                    <div className={`phase-label ${phase.color}`}>
                      {phase.name}
                      <button style={{ marginLeft: "8px", fontSize: "12px" }} onClick={() => addTask(phaseKey)}>+</button>
                    </div>
                  </div>

                  <div className="tasks-container">
                    {tasksArray.map(([taskKey, task]) => (
                      <DraggableTask
                        key={taskKey}
                        task={task}
                        taskKey={taskKey}
                        phaseKey={phaseKey}
                        moveTask={moveTask}
                        openEditModal={openEditModal}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Edit Modal */}
            {showModal && editingTask && (
              <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5>Edit Task</h5>
                      <button onClick={() => setShowModal(false)} style={{ marginLeft: "auto" }}>&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group mb-2">
                        <label>Task Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingTask.text}
                          onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label>Owner</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingTask.owner || ""}
                          onChange={(e) => setEditingTask({ ...editingTask, owner: e.target.value })}
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label>Description</label>
                        <textarea
                          className="form-control"
                          value={editingTask.description || ""}
                          onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label>Timeline</label>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            type="date"
                            className="form-control"
                            value={editingTask.startDate || ""}
                            onChange={(e) => setEditingTask({ ...editingTask, startDate: e.target.value })}
                          />
                          <span style={{ alignSelf: "center" }}>to</span>
                          <input
                            type="date"
                            className="form-control"
                            value={editingTask.endDate || ""}
                            onChange={(e) => setEditingTask({ ...editingTask, endDate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        onClick={deleteTask}
                        style={{ backgroundColor: "red", color: "white" }}
                      >
                        Delete
                      </button>
                      <button onClick={() => setShowModal(false)}>Cancel</button>
                      <button onClick={saveTaskChanges}>Save</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="footer">
          <p>© 2025 Luna Product Dashboard | INFO 340 Project</p>
        </footer>
      </div>
    </DndProvider>
  );
};

export default RoadmapPage;