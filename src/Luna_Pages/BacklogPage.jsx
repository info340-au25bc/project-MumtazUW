import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Header from "./header";
import '../css/kanbanBacklog.css';
import { getDatabase, ref, onValue, set as firebaseSet, push as firebasePush } from "firebase/database";

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

  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterRecency, setFilterRecency] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const backlogRef = ref(db, "backlogItems");

    const unregisterFunction = onValue(backlogRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
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
      .then(() => closeEditModal())
      .catch((err) => console.log(err));
  }

  function handleEditChange(event) {
    const { name, value } = event.target;
    setEditingItem(prev => ({ ...prev, [name]: value }));
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.feature || !formData.owner || !formData.description || !formData.status || !formData.priority || !formData.dueDate) {
      setFormError('Please fill in all fields before adding an item to the backlog.');
      return;
    }

    const db = getDatabase();
    const backlogRef = ref(db, "backlogItems");
    const newItem = { ...formData };

    firebasePush(backlogRef, newItem)
      .then(() => {
        setFormData({ feature: '', owner: '', description: '', status: '', priority: '', dueDate: '' });
        setFormError('');
        setFormKey(prev => prev + 1);
      })
      .catch((err) => console.log(err));
  }

  function deleteItem(id) {
    const db = getDatabase();
    const itemRef = ref(db, "backlogItems/" + id);
    firebaseSet(itemRef, null).catch((err) => console.log(err));
  }

  let filteredItems = [...backlogItems];

  if (filterPriority) filteredItems = filteredItems.filter(item => item.priority === filterPriority);
  if (filterAssignee) filteredItems = filteredItems.filter(item => item.owner === filterAssignee);

  if (filterRecency === 'Newest First') {
    filteredItems.sort((a, b) => (b.id > a.id ? 1 : -1));
  } else if (filterRecency === 'Oldest First') {
    filteredItems.sort((a, b) => (a.id > b.id ? 1 : -1));
  }

  const plannedItems = filteredItems.filter(item => item.status === 'Planned');
  const inProgressItems = filteredItems.filter(item => item.status === 'In Progress');
  const completedItems = filteredItems.filter(item => item.status === 'Completed');

  return (
    <div className="BacklogPage">
      <Header />
      <div className="backlog-container">
        <aside className="sidebar">
          <h2>Navigation</h2>
          <nav>
            <ul>
              <li><NavLink to="/">Project Overview</NavLink></li>
              <li><NavLink to="/projects">Projects</NavLink></li>
              <li><NavLink to="/roadmap">Roadmap</NavLink></li>
              <li><NavLink to="/backlog" className="active">Tasks and Backlog</NavLink></li>
              <li><NavLink to="/notifications">Notifications</NavLink></li>
            </ul>
          </nav>
        </aside>

        <main className="backlog-main">
          {/* Backlog Form */}
          <form id="backlogForm" key={formKey} onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input type="text" name="feature" placeholder="Feature name" value={formData.feature} onChange={handleInputChange} aria-label="Feature name"/>
              </div>
              <div className="form-group">
                <input type="text" name="owner" placeholder="Owner" value={formData.owner} onChange={handleInputChange} aria-label="Owner"/>
              </div>
              <div className="form-group">
                <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} aria-label="Description"/>
              </div>
              <div className="form-group">
                <select name="status" value={formData.status} onChange={handleInputChange} aria-label="Status">
                  <option value="">Status</option>
                  <option>Planned</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="form-group">
                <select name="priority" value={formData.priority} onChange={handleInputChange} aria-label="Priority Level">
                  <option value="">Priority</option>
                  <option>Critical (P0)</option>
                  <option>High (P1)</option>
                  <option>Functional (P2)</option>
                  <option>Enhancement (P3)</option>
                </select>
              </div>
              <div className="form-group">
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} aria-label="Due date"/>
              </div>
              <button type="submit">Add Item</button>
            </div>
          </form>

          {/* Filters */}
          <div className="filters-bar">
            <div className="filter-group">
              <label htmlFor="filterPriority">Priority:</label>
              <select id="filterPriority" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                <option value="">All</option>
                <option>Critical (P0)</option>
                <option>High (P1)</option>
                <option>Functional (P2)</option>
                <option>Enhancement (P3)</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filterAssignee">Assignee:</label>
              <select id="filterAssignee" value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}>
                <option value="">All</option>
                <option>Mumtaz</option>
                <option>Angel</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filterRecency">Recency:</label>
              <select id="filterRecency" value={filterRecency} onChange={e => setFilterRecency(e.target.value)}>
                <option value="">All</option>
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="kanban-container">
            <div className="kanban-columns">
              {/* Planned */}
              <div className="column">
                <h3>Planned</h3>
                <div className="card-container">
                  {plannedItems.map(item => (
                    <div key={item.id} className="card" onClick={() => openEditModal(item)} style={{ cursor: 'pointer' }}>
                      <h4 className="card-header">{item.feature}</h4>
                      <p className="card-subtitle">
                        <span className="card-priority">{item.priority}</span>
                        <span className="card-owner"> Owner: {item.owner}</span>
                      </p>
                      <p className="card-content">{item.description}</p>
                      <p className="card-due"><strong>Due:</strong> {item.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress */}
              <div className="column">
                <h3>In Progress</h3>
                <div className="card-container">
                  {inProgressItems.map(item => (
                    <div key={item.id} className="card" onClick={() => openEditModal(item)} style={{ cursor: 'pointer' }}>
                      <h4 className="card-header">{item.feature}</h4>
                      <p className="card-subtitle">
                        <span className="card-priority">{item.priority}</span>
                        <span className="card-owner"> Owner: {item.owner}</span>
                      </p>
                      <p className="card-content">{item.description}</p>
                      <p className="card-due"><strong>Due:</strong> {item.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed */}
              <div className="column">
                <h3>Completed</h3>
                <div className="card-container">
                  {completedItems.map(item => (
                    <div key={item.id} className="card" onClick={() => openEditModal(item)} style={{ cursor: 'pointer' }}>
                      <h4 className="card-header">{item.feature}</h4>
                      <p className="card-subtitle">
                        <span className="card-priority">{item.priority}</span>
                        <span className="card-owner"> Owner: {item.owner}</span>
                      </p>
                      <p className="card-content">{item.description}</p>
                      <p className="card-due"><strong>Due:</strong> {item.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {showModal && editingItem && (
            <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Backlog Item</h5>
                    <button type="button" className="close" style={{ marginLeft: 'auto' }} onClick={closeEditModal}>
                      <span>&times;</span>
                    </button>
                  </div>
                  <form onSubmit={handleEditSubmit}>
                    <div className="modal-body">
                      <div className="form-group mb-2">
                        <label htmlFor="edit-feature">Feature name</label>
                        <input id="edit-feature" type="text" name="feature" value={editingItem.feature} onChange={handleEditChange} className="form-control" placeholder="Feature name"/>
                      </div>
                      <div className="form-group mb-2">
                        <label htmlFor="edit-owner">Owner</label>
                        <input id="edit-owner" type="text" name="owner" value={editingItem.owner} onChange={handleEditChange} className="form-control" placeholder="Owner"/>
                      </div>
                      <div className="form-group mb-2">
                        <label htmlFor="edit-description">Description</label>
                        <textarea id="edit-description" name="description" value={editingItem.description} onChange={handleEditChange} className="form-control" placeholder="Description"/>
                      </div>
                      <div className="form-group mb-2">
                        <label htmlFor="edit-status">Status</label>
                        <select id="edit-status" name="status" value={editingItem.status} onChange={handleEditChange} className="form-control">
                          <option>Planned</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>
                      <div className="form-group mb-2">
                        <label htmlFor="edit-priority">Priority</label>
                        <select id="edit-priority" name="priority" value={editingItem.priority} onChange={handleEditChange} className="form-control">
                          <option>Critical (P0)</option>
                          <option>High (P1)</option>
                          <option>Functional (P2)</option>
                          <option>Enhancement (P3)</option>
                        </select>
                      </div>
                      <div className="form-group mb-2">
                        <label htmlFor="edit-dueDate">Due date</label>
                        <input id="edit-dueDate" type="date" name="dueDate" value={editingItem.dueDate} onChange={handleEditChange} className="form-control"/>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger" onClick={() => { deleteItem(editingItem.id); closeEditModal(); }}>Delete</button>
                      <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                      <button type="submit" className="btn btn-primary">Save changes</button>
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