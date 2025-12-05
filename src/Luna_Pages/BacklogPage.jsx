import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Header from "./header";
import '../css/global.css';
import { getDatabase, ref, onValue, set as firebaseSet, push as firebasePush, set } from "firebase/database";

function BacklogPage() {
  const [backlogItems, setBacklogItems] = useState([]);
  const [formData, setFormData] = useState({
    feature: '',
    owner: '',
    description: '',
    status: '',
    priority: '',
    dueDate: ''
  });
  const [formError, setFormError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const db = getDatabase();
    const backlogRef = ref(db, "backlogItems");

    const unregisterFunction = onValue(backlogRef, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        setBacklogItems([]);
      } else {
        const keys = Object.keys(data);
        const itemsArray = keys.map((key) => {
          const oneItem = { ...data[key] };
          oneItem.id = key;
          return oneItem;
        });
        setBacklogItems(itemsArray);
      }
    });

    return () => unregisterFunction();
  }, []);


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

    const db = getDatabase();
    const itemRef = ref(db, "backlogItems/" + editingItem.id);

    const { id, ...itemData } = editingItem;

    firebaseSet(itemRef, itemData)
      .then(() => {
        closeEditModal();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEditChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setEditingItem(function(prev) {
      return {
        ...prev,
        [name]: value
      };
    });
  }

  function handleInputChange(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setFormError('');
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
      setFormError('Please fill in all fields before adding an item to the backlog.');
      return;
    }

    const db = getDatabase();
    const backlogRef = ref(db, "backlogItems");
    const newItem = {
      feature: formData.feature,
      owner: formData.owner,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate
    };

    firebasePush(backlogRef, newItem)
      .then(() => {
        setFormData({
          feature: '',
          owner: '',
          description: '',
          status: '',
          priority: '',
          dueDate: ''
        });
        setFormError('');
        setFormKey(prev => prev + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteItem(id) {
    const db = getDatabase();
    const itemRef = ref(db, "backlogItems/" + id);

    firebaseSet(itemRef, null)
      .catch((err) => {
        console.log(err);
      });
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
        <aside className="sidebar">
          <h2>Navigation</h2>
          <nav>
            <ul>
              <li>
                <NavLink to="/">
                  Project Overview
                </NavLink>
              </li>
              <li>
                <NavLink to="/projects">
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink to="/roadmap">
                  Roadmap
                </NavLink>
              </li>
              <li>
                <NavLink to="/backlog" className="active">
                  Tasks and Backlog
                </NavLink>
              </li>
              <li>
                <NavLink to="/notifications">Notifications</NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="backlog-main">
          <form id="backlogForm" key={formKey} onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="feature" className="sr-only">
                  Feature name
                </label>
                <input
                  aria-label="Feature name"
                  type="text"
                  id="feature"
                  name="feature"
                  placeholder="Feature name"
                  value={formData.feature}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="owner" className="sr-only">
                  Owner
                </label>
                <input
                  aria-label="Owner"
                  type="text"
                  id="owner"
                  name="owner"
                  placeholder="Owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="sr-only">
                  Description
                </label>
                <input
                  aria-label="Description"
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status" className="sr-only">
                  Status
                </label>
                <select
                  aria-label="Status"
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
              </div>

              <div className="form-group">
                <label htmlFor="priority" className="sr-only">
                  Priority
                </label>
                <select
                  aria-label="Priority Level"
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
              </div>

              <div className="form-group">
                <label htmlFor="dueDate" className="sr-only">
                  Due date
                </label>
                <input
                  aria-label="Due date"
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit">Add Item</button>
            </div>
          </form>

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

          <div className="kanban-container">
            <div className="kanban-columns">
              <div className="column">
                <h3>Planned</h3>
                <div className="card-container" id="plannedContainer">
                  {plannedItems.map(function(item) {
                    return (
                      <div
                        className="card"
                        key={item.id}
                        onClick={function() {
                          openEditModal(item);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <h4 className="card-header">{item.feature}</h4>
                        <p className="card-subtitle">
                          <span className="card-priority">{item.priority}</span>
                          <span className="card-owner"> Owner: {item.owner}</span>
                        </p>
                        <p className="card-content">
                          {item.description}
                        </p>
                        <p className="card-due">
                          <strong>Due:</strong> {item.dueDate}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="column">
                <h3>In Progress</h3>
                <div className="card-container" id="progressContainer">
                  {inProgressItems.map(function(item) {
                    return (
                      <div
                        className="card"
                        key={item.id}
                        onClick={function() {
                          openEditModal(item);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <h4 className="card-header">{item.feature}</h4>
                        <p className="card-subtitle">
                          <span className="card-priority">{item.priority}</span>
                          <span className="card-owner"> Owner: {item.owner}</span>
                        </p>
                        <p className="card-content">
                          {item.description}
                        </p>
                        <p className="card-due">
                          <strong>Due:</strong> {item.dueDate}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="column">
                <h3>Completed</h3>
                <div className="card-container" id="completedContainer">
                  {completedItems.map(function(item) {
                    return (
                      <div
                        className="card"
                        key={item.id}
                        onClick={function() {
                          openEditModal(item);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <h4 className="card-header">{item.feature}</h4>
                        <p className="card-subtitle">
                          <span className="card-priority">{item.priority}</span>
                          <span className="card-owner"> Owner: {item.owner}</span>
                        </p>
                        <p className="card-content">
                          {item.description}
                        </p>
                        <p className="card-due">
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
              tabIndex={-1}
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
                          aria-label="Edit Feature"
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
                          aria-label="Edit Owner"
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
                          aria-label="Edit Status"
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
                          aria-label="Edit Priority"
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
                          aria-label="Edit Due date"
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
                        onClick={function() {
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