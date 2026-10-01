import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/parts";

function App() {
  const [parts, setParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    partName: "",
    brand: "",
    compatibleModel: "",
    price: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchParts = async () => {
    try {
      const response = await axios.get(API_URL);
      setParts(response.data);
    } catch (error) {
      console.error("Failed to fetch parts:", error);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = {
        partName: form.partName,
        brand: form.brand,
        compatibleModel: form.compatibleModel,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post(API_URL, data);
      }

      setForm({
        partName: "",
        brand: "",
        compatibleModel: "",
        price: "",
        stock: "",
      });

      await fetchParts();
    } catch (error) {
      console.error("Failed to save part:", error);
      alert("Failed to save part. Make sure the backend is running.");
    }
  };

  const handleEdit = (part) => {
    setEditingId(part._id);

    setForm({
      partName: part.partName,
      brand: part.brand,
      compatibleModel: part.compatibleModel,
      price: part.price,
      stock: part.stock,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this part?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchParts();
    } catch (error) {
      console.error("Failed to delete part:", error);
      alert("Failed to delete part.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);

    setForm({
      partName: "",
      brand: "",
      compatibleModel: "",
      price: "",
      stock: "",
    });
  };

  /* Search */
  const filteredParts = parts.filter(
    (part) =>
      part.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.compatibleModel
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  /* Summary */
  const totalParts = parts.length;

  const totalStock = parts.reduce(
    (total, part) => total + Number(part.stock),
    0
  );

  const totalInventoryValue = parts.reduce(
    (total, part) => total + Number(part.price) * Number(part.stock),
    0
  );

  return (
    <div className="container">
      <h1>Motor Parts Inventory System</h1>

      <p className="subtitle">
        Manage motor parts, brands, compatible models, prices, and stock.
      </p>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <span>Total Parts</span>
          <strong>{totalParts}</strong>
        </div>

        <div className="summary-card">
          <span>Total Stock</span>
          <strong>{totalStock}</strong>
        </div>

        <div className="summary-card">
          <span>Inventory Value</span>
          <strong>₱{totalInventoryValue.toLocaleString()}</strong>
        </div>
      </div>

      {/* Add / Edit Form */}
      <div className="form-card">
        <h2>{editingId ? "Edit Motor Part" : "Add Motor Part"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              type="text"
              name="partName"
              placeholder="Part Name"
              value={form.partName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="compatibleModel"
              placeholder="Compatible Model"
              value={form.compatibleModel}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              min="0"
              required
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <button type="submit" className="primary-button">
            {editingId ? "Update Part" : "Add Part"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Motor Parts Table */}
      <div className="table-card">
        <div className="table-header">
          <h2>Motor Parts List</h2>

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search parts..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                className="clear-search-button"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {filteredParts.length === 0 ? (
          <p>No motor parts found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Part Name</th>
                <th>Brand</th>
                <th>Compatible Model</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParts.map((part) => (
                <tr key={part._id}>
                  <td>{part.partName}</td>
                  <td>{part.brand}</td>
                  <td>{part.compatibleModel}</td>
                  <td>₱{Number(part.price).toFixed(2)}</td>

                  <td>
                    {Number(part.stock) <= 5 ? (
                      <span className="low-stock">
                        Low Stock ({part.stock})
                      </span>
                    ) : (
                      part.stock
                    )}
                  </td>

                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(part)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(part._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;