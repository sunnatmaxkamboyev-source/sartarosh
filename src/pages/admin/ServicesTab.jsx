import { useEffect, useState } from "react";
import {
  addService,
  deleteService,
  getServices,
  updateService,
} from "../../api/api.js";

const onlyDigits = (v) => v.replace(/\D/g, "");

export default function ServicesTab() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const load = () => getServices().then(setServices);

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Xizmat nomini kiriting");
    if (!Number(price)) return setError("Narxni kiriting");
    setError("");
    await addService({ name: name.trim(), price });
    setName("");
    setPrice("");
    load();
  };

  const startEdit = (s) => {
    setEditId(s.id);
    setEditName(s.name);
    setEditPrice(String(s.price));
  };

  const saveEdit = async () => {
    if (editName.trim().length < 2 || !Number(editPrice)) return;
    await updateService(editId, { name: editName.trim(), price: editPrice });
    setEditId(null);
    load();
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`"${s.name}" xizmatini o'chirasizmi?`)) return;
    await deleteService(s.id);
    load();
  };

  return (
    <div className="panel">
      <form className="service-add" onSubmit={handleAdd}>
        <input
          className="input"
          placeholder="Xizmat nomi"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input price"
          inputMode="numeric"
          placeholder="Narxi (so'm)"
          value={price}
          onChange={(e) => setPrice(onlyDigits(e.target.value))}
        />
        <button type="submit" className="btn-primary">
          Qo'shish
        </button>
      </form>
      {error && <div className="error-text">{error}</div>}

      <div className="service-list">
        {services.length === 0 && <p className="empty">Xizmatlar yo'q</p>}

        {services.map((s) =>
          editId === s.id ? (
            <div key={s.id} className="service-row">
              <input
                className="input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                className="input price"
                inputMode="numeric"
                value={editPrice}
                onChange={(e) => setEditPrice(onlyDigits(e.target.value))}
              />
              <div className="row-actions">
                <button className="btn-small" onClick={saveEdit}>
                  Saqlash
                </button>
                <button className="btn-small" onClick={() => setEditId(null)}>
                  Bekor
                </button>
              </div>
            </div>
          ) : (
            <div key={s.id} className="service-row">
              <div className="service-name">{s.name}</div>
              <div className="service-price">
                {s.price.toLocaleString("ru-RU")} so'm
              </div>
              <div className="row-actions">
                <button className="btn-small" onClick={() => startEdit(s)}>
                  Tahrirlash
                </button>
                <button className="btn-small danger" onClick={() => handleDelete(s)}>
                  O'chirish
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}