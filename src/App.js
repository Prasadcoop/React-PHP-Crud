import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const API = 'http://localhost:3000/Backend/api.php';
const API = process.env.REACT_APP_API_URL;

const ITEMS_PER_PAGE = 5;

function App() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', id: null });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetch(API)
            .then(res => res.json())
            .then(data => setUsers(data.data || data)); // Handle case where `data` might be wrapped
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = form.id ? 'PUT' : 'POST';

        fetch(API, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(() => window.location.reload());
    };

    const handleEdit = (user) => {
        setForm(user);
    };

    const handleDelete = (id) => {
        fetch(`${API}?id=${id}`, { method: 'DELETE' })
            .then(() => window.location.reload());
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

   
    return (
        <div>
            <div className="container mt-5 content-form">
                <h2 className="mb-4">User Management</h2>

                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="row g-3 align-items-center">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="date"
                                className="form-control"
                                placeholder="dob"
                                value={form.dob}
                                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary">
                                {form.id ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className='container mt-5'>
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>DOB</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                        {currentUsers.length > 0 ? currentUsers.map((user , index) => (
                            <tr key={user.id}>
                                <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.dob}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(user)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center">No users found</td>
                            </tr>
                        )}
                    </tbody>

                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {[...Array(totalPages).keys()].map(number => (
                            <li
                                key={number + 1}
                                className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                            >
                                <button onClick={() => handlePageChange(number + 1)} className="page-link">
                                    {number + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default App;
