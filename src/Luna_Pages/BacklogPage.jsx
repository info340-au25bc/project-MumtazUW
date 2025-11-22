// This is BacklogPage component
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header from "./header";
import '../css/kanbanBacklog.css';
// Modal from Bootstrap: https://getbootstrap.com/docs/4.0/components/modal/
const TESTER_BACKLOG = [
  {
    id: 1,
    feature: 'Planned Item Tester',
    owner: 'Angel',
    description: 'Planned Item Tester',
    status: 'Planned',
    priority: 'High (P1)',
    dueDate: '2025-03-31'
  },
  {
    id: 2,
    feature: 'Planned Item Tester 2',
    owner: 'Team',
    description: 'Planned Item Tester 2',
    status: 'Planned',
    priority: 'Functional (P2)',
    dueDate: '2025-04-05'
  },
  {
    id: 3,
    feature: 'In Progress Item Tester',
    owner: 'Mumtaz',
    description: 'IP Item Tester',
    status: 'In Progress',
    priority: 'Critical (P0)',
    dueDate: '2025-03-20'
  },
  {
    id: 4,
    feature: 'Completed Item Tester 2',
    owner: 'Angel',
    description: 'Complete Item Tester',
    status: 'Completed',
    priority: 'High (P1)',
    dueDate: '2025-03-01'
  }
];
function BacklogPage() {
  const [backlogItems, setBacklogItems] = useState(TESTER_BACKLOG);

  const [formData, setFormData] = useState({
    feature: '',
    owner: '',
    description: '',
    status: '',
    priority: '',
    dueDate: ''
  });

  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  function openEditModal(item) {
    setEditingItem(item);
    setShowModal(true);
  }

  function closeEditModal() {
    setEditingItem(null);
    setShowModal(false);
  }

  function handleEditSubmit(event) {
    event.preventDefault();
    setBacklogItems(prev =>
      prev.map(it => {
        if (it.id === editingItem.id) {
          return editingItem;
        } else {
          return it;
        }
      })
    );
    closeEditModal();
  }
  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditingItem(prev => ({
      ...prev,
      [name]: value
    }));
  }
  function handleInputChange(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setFormData(function(prev) {
      return {
        ...prev,
        [fieldName]: fieldValue
      };
    });
  }
  function handleSubmit(event) {
    event.preventDefault();

    if (
      formData.feature === '' ||
      formData.owner === '' ||
      formData.description === '' ||
      formData.status === '' ||
      formData.priority === '' ||
      formData.dueDate === ''
    ) {
      // maybe add a message here for errors?
      return;
    }

    const newItem = {
      id: Date.now(),
      feature: formData.feature,
      owner: formData.owner,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate
    };
    // Shows newest items first, typical with backlogs.
    setBacklogItems(function(prevItems) {
      return [newItem].concat(prevItems);
    });

    // this resets form
    setFormData({
      feature: '',
      owner: '',
      description: '',
      status: '',
      priority: '',
      dueDate: ''
    });
  }

  // Delete an item
  function deleteItem(id) {
    setBacklogItems(prev => prev.filter(item => item.id !== id));
  }

  const plannedItems = backlogItems.filter(function(item) {
    return item.status === 'Planned';
  });
  const inProgressItems = backlogItems.filter(function(item) {
    return item.status === 'In Progress';
  });
  const completedItems = backlogItems.filter(function(item) {
    return item.status === 'Completed';
  });

  return (
    <div className="BacklogPage">
      <Header />
      <div className="backlog-container">
        {/* Nav/Sidebar */}
        <aside className="sidebar">
          <h2>Navigation</h2>
          <nav>
            <ul>
              <li>
                <NavLink to="/" className="active">
                  Project Overview
                </NavLink>
              </li>
              <li>
                <NavLink to="/roadmap">Roadmap</NavLink>
              </li>
              <li>
                <NavLink to="/backlog">Tasks and Backlog</NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="backlog-main mt-5 pt-5">
          {/* Backlog Form */}
          <form id="backlogForm" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                id="feature"
                name="feature"
                placeholder="Feature name"
                value={formData.feature}
                onChange={handleInputChange}
              />
              <input
                type="text"
                id="owner"
                name="owner"
                placeholder="Owner"
                value={formData.owner}
                onChange={handleInputChange}
              />
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
              />
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="">Status</option>
                <option>Planned</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="">Priority</option>
                <option>Critical (P0)</option>
                <option>High (P1)</option>
                <option>Functional (P2)</option>
                <option>Enhancement (P3)</option>
              </select>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
              />
              <button type="submit">Add Item</button>
            </div>
          </form>

          {/* Filters row - Static right now!! */}
          <div className="filters-bar">
            <div className="filter-group">
              <label htmlFor="filterPriority">Priority:</label>
              <select id="filterPriority">
                <option value="">All</option>
                <option>Critical (P0)</option>
                <option>High (P1)</option>
                <option>Functional (P2)</option>
                <option>Enhancement (P3)</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filterAssignee">Assignee:</label>
              <select id="filterAssignee">
                <option value="">All</option>
                <option>Mumtaz</option>
                <option>Angel</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filterRecency">Recency:</label>
              <select id="filterRecency">
                <option value="">All</option>
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </div>
          </div>
          {/* The Kanban board */}
          <div className="kanban-container">
            <div className="kanban-columns">
              {/* Planned Col*/}
              <div className="column">
                <h2>Planned</h2>
                <div className="card-container" id="plannedContainer">
                  {plannedItems.map(function(item) {
                    return (
                      <div
                        className="card"
                        key={item.id}
                        onClick={() => openEditModal(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <h3 className="card-header">{item.feature}</h3>
                        <p className="card-content">
                          {item.description}
                          <br />
                          <strong>Owner:</strong> {item.owner}
                          <br />
                          <strong>Priority:</strong> {item.priority}
                          <br />
                          <strong>Due:</strong> {item.dueDate}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* In Progress Col */}
              <div className="column">
                <h2>In Progress</h2>
                <div className="card-container" id="progressContainer">
                  {inProgressItems.map(function(item) {
                    return (
                      <div
                        className="card"
                        key={item.id}
                        onClick={() => openEditModal(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <h3 className="card-header">{item.feature}</h3>
                        <p className="card-content">
                          {item.description}
                          <br />
                          <strong>Owner:</strong> {item.owner}
                          <br />
                          <strong>Priority:</strong> {item.priority}
                          <br />
                          <strong>Due:</strong> {item.dueDate}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Completed Col */}
              <div className="column">
                <h2>Completed</h2>
                <div className="card-container" id="completedContainer">
                  {completedItems.map(function(item) {
                    return (
                      <div
                        className="card"
                        key={item.id}
                        onClick={() => openEditModal(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <h3 className="card-header">{item.feature}</h3>
                        <p className="card-content">
                          {item.description}
                          <br />
                          <strong>Owner:</strong> {item.owner}
                          <br />
                          <strong>Priority:</strong> {item.priority}
                          <br />
                          <strong>Due:</strong> {item.dueDate}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {showModal && editingItem && (
            <div
              className="modal fade show"
              style={{ display: "block" }}
              tabIndex="-1"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Backlog Item</h5>
                    <button
                      type="button"
                      className="close"
                      style={{ marginLeft: "auto" }}
                      onClick={closeEditModal}
                    >
                      <span>&times;</span>
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit}>
                    <div className="modal-body">
                      <div className="form-group mb-2">
                        <label htmlFor="edit-feature">Feature name</label>
                        <input
                          id="edit-feature"
                          type="text"
                          name="feature"
                          value={editingItem.feature}
                          onChange={handleEditChange}
                          className="form-control"
                          placeholder="Feature name"
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="edit-owner">Owner</label>
                        <input
                          id="edit-owner"
                          type="text"
                          name="owner"
                          value={editingItem.owner}
                          onChange={handleEditChange}
                          className="form-control"
                          placeholder="Owner"
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="edit-description">Description</label>
                        <textarea
                          id="edit-description"
                          name="description"
                          value={editingItem.description}
                          onChange={handleEditChange}
                          className="form-control"
                          placeholder="Description"
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="edit-status">Status</label>
                        <select
                          id="edit-status"
                          name="status"
                          value={editingItem.status}
                          onChange={handleEditChange}
                          className="form-control"
                        >
                          <option>Planned</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="edit-priority">Priority</label>
                        <select
                          id="edit-priority"
                          name="priority"
                          value={editingItem.priority}
                          onChange={handleEditChange}
                          className="form-control"
                        >
                          <option>Critical (P0)</option>
                          <option>High (P1)</option>
                          <option>Functional (P2)</option>
                          <option>Enhancement (P3)</option>
                        </select>
                      </div>

                      <div className="form-group mb-2">
                        <label htmlFor="edit-dueDate">Due date</label>
                        <input
                          id="edit-dueDate"
                          type="date"
                          name="dueDate"
                          value={editingItem.dueDate}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          deleteItem(editingItem.id);
                          closeEditModal();
                        }}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeEditModal}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
      <footer>© 2025 Luna Product Dashboard | INFO 340 Project</footer>
    </div>
  );
}
export default BacklogPage;
