import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../css/roadmap.css';

const ItemTypes = {
  TASK: 'task'
};

// Draggable Task Component using react-dnd library
const DraggableTask = ({ task, index, phaseIndex, moveTask, openEditModal }) => {
  const [, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { task, index, phaseIndex },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item) {
      if (item.phaseIndex === phaseIndex && item.index !== index) {
        moveTask(phaseIndex, item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div className="task-row">
      <div
        ref={(node) => drag(drop(node))}
        className={`task-bar ${task.color}`}
        style={{
          left: `${(task.start / 12) * 100}%`,
          width: `${(task.duration / 12) * 100}%`,
          cursor: 'grab'
        }}
        onClick={() => openEditModal(task, phaseIndex)}
      >
        {task.text}
      </div>
    </div>
  );
};

const RoadmapPage = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [phases, setPhases] = useState([
    {
      name: 'Idea Generation',
      color: 'idea-generation',
      tasks: [
        { text: 'Conduct market research', start: 1, duration: 4, color: 'idea-generation' },
        { text: 'Brainstorm solutions', start: 1.5, duration: 3, color: 'idea-generation' },
        { text: 'Evaluate feasibility', start: 2.5, duration: 3, color: 'idea-generation' },
      ]
    },
    {
      name: 'Concept Development',
      color: 'concept-development',
      tasks: [
        { text: 'Define target customer', start: 3, duration: 2.5, color: 'concept-development' },
        { text: 'Create prototypes', start: 4, duration: 3, color: 'concept-development' },
        { text: 'Gather feedback', start: 5, duration: 4, color: 'concept-development' },
      ]
    },
    {
      name: 'Design & Development',
      color: 'design-development',
      tasks: [
        { text: 'Refine prototypes', start: 6, duration: 3, color: 'design-development' },
        { text: 'Collaborate with teams', start: 7, duration: 3.5, color: 'design-development' },
        { text: 'Develop MVP', start: 8, duration: 4, color: 'design-development' },
      ]
    },
    {
      name: 'Testing & Iteration',
      color: 'testing-iteration',
      tasks: [
        { text: 'Usability & quality testing', start: 9, duration: 3.5, color: 'testing-iteration' },
        { text: 'Iterate product', start: 10.5, duration: 2.5, color: 'testing-iteration' },
        { text: 'Finalize features', start: 11, duration: 2, color: 'testing-iteration' },
      ]
    }
  ]);

  const [editingTask, setEditingTask] = useState(null);
  const [editingPhaseIndex, setEditingPhaseIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openEditModal = (task, phaseIndex) => {
    setEditingTask(task);
    setEditingPhaseIndex(phaseIndex);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setEditingPhaseIndex(null);
    setShowModal(false);
  };

  const saveTaskChanges = (updatedTask) => {
    setPhases(prev =>
      prev.map((phase, pIdx) => {
        if (pIdx !== editingPhaseIndex) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map(task =>
            task === editingTask ? { ...updatedTask, color: phase.color } : task
          )
        };
      })
    );
    closeModal();
  };

  const moveTask = (phaseIndex, fromIndex, toIndex) => {
    setPhases(prev => {
      const phase = { ...prev[phaseIndex] };
      const updatedTasks = [...phase.tasks];
      const [moved] = updatedTasks.splice(fromIndex, 1);
      updatedTasks.splice(toIndex, 0, moved);
      phase.tasks = updatedTasks;
      const newPhases = [...prev];
      newPhases[phaseIndex] = phase;
      return newPhases;
    });
  };

  const addTask = (phaseIndex) => {
    const newTask = { text: 'New Task', start: 1, duration: 1, color: phases[phaseIndex].color };
    setPhases(prev => {
      const updated = [...prev];
      updated[phaseIndex].tasks.push(newTask);
      return updated;
    });
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
              <li><NavLink to="/">Project Overview</NavLink></li>
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
              <div className="phase-label-spacer">
              </div>
              <div className="months-container">
                {months.map((month, idx) => (
                  <div key={idx} className="month-cell">{month}</div>
                ))}
              </div>
            </div>

            {phases.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="phase-row">
                <div className="phase-label-container">
                  <div className={`phase-label ${phase.color}`}>
                    {phase.name}
                    <button
                      style={{ marginLeft: '8px', fontSize: '12px' }}
                      onClick={() => addTask(phaseIndex)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="tasks-container">
                  {phase.tasks.map((task, taskIndex) => (
                    <DraggableTask
                      key={taskIndex}
                      task={task}
                      index={taskIndex}
                      phaseIndex={phaseIndex}
                      moveTask={moveTask}
                      openEditModal={openEditModal}
                    />
                  ))}
                </div>
              </div>
            ))}

{showModal && editingTask && (
  <div className="modal fade show" style={{ display: 'block' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Edit Task</h5>
          <button onClick={closeModal} style={{ marginLeft: 'auto' }}>&times;</button>
        </div>
        <div className="modal-body">
          {/* Task Name */}
          <div className="form-group mb-2">
            <label htmlFor="edit-task-name">Task Name</label>
            <input
              id="edit-task-name"
              type="text"
              value={editingTask.text}
              onChange={(e) =>
                setEditingTask({ ...editingTask, text: e.target.value })
              }
              className="form-control"
            />
          </div>

          {/* Owner */}
          <div className="form-group mb-2">
            <label htmlFor="edit-task-owner">Owner</label>
            <input
              id="edit-task-owner"
              type="text"
              value={editingTask.owner || ''}
              onChange={(e) =>
                setEditingTask({ ...editingTask, owner: e.target.value })
              }
              className="form-control"
            />
          </div>

          {/* Description */}
          <div className="form-group mb-2">
            <label htmlFor="edit-task-desc">Description</label>
            <textarea
              id="edit-task-desc"
              value={editingTask.description || ''}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
              className="form-control"
            />
          </div>

          {/* Timeline */}
          <div className="form-group mb-2">
            <label>Timeline</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="date"
                value={editingTask.startDate || ''}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, startDate: e.target.value })
                }
                className="form-control"
              />
              <span style={{ alignSelf: 'center' }}>to</span>
              <input
                type="date"
                value={editingTask.endDate || ''}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, endDate: e.target.value })
                }
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={() => {
              setPhases(prev => {
                const newPhases = [...prev];
                newPhases[editingPhaseIndex].tasks = newPhases[editingPhaseIndex].tasks.filter(t => t !== editingTask);
                return newPhases;
              });
              closeModal();
            }}
            style={{ backgroundColor: 'red', color: 'white' }}
          >
            Delete
          </button>
          <button onClick={closeModal}>Cancel</button>
          <button onClick={() => saveTaskChanges(editingTask)}>Save</button>
        </div>
      </div>
    </div>
  </div>
)}

          </div>
        </main>

        <footer className="footer">
          <p>© 2025 Luna Health Product Dashboard | INFO 340 Project</p>
        </footer>
      </div>
    </DndProvider>
  );
};

export default RoadmapPage;