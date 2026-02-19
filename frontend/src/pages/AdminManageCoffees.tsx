import { useEffect, useState, type FormEvent } from "react";
import { useCoffeeStore } from "../store/useCoffeeStore";
import { useAdminStore } from "../store/useAdminStore";
import AdminCoffeForm from "../components/AdminCoffeForm";

const AdminManageCoffees = () => {
  const { getCoffee, coffee: coffees } = useCoffeeStore();
  const { addCoffee, editCoffee, deleteCoffee } = useAdminStore();

  const [deleteId, setDeleteId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    price: 0,
    image: "",
    description: "",
  });

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    editCoffee(editId, formData);
    setEditId("");
  };

  const handleEdit = (coffee: Coffee) => {
    setEditId(coffee._id!);
    setFormData({
      title: coffee.title,
      type: coffee.type,
      price: coffee.price,
      image: coffee.image,
      description: coffee.description,
    });
  };

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await addCoffee(formData);
    setIsOpen(false);
    setFormData({
      title: "",
      type: "",
      price: 0,
      image: "",
      description: "",
    });
    await getCoffee();
  };

  const handleDelete = async (coffeeId: string) => {
    await deleteCoffee(coffeeId);
    setDeleteId("");
    await getCoffee();
  };

  const handleAddFormOpen = () => {
    setIsOpen(true);
    setFormData({
      title: "",
      type: "",
      price: 0,
      image: "",
      description: "",
    });
  };

  useEffect(() => {
    getCoffee();
  }, []);

  return (
    <div className="py-40 bg-[#333] min-h-screen w-screen font-mono gap-10 text-white flex flex-col items-center justify-center p-2">
      <h1 className="text-5xl">All Coffees</h1>
      <button onClick={handleAddFormOpen} className="p-2 border cursor-pointer">
        Add New Coffee
      </button>
      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {coffees.map((coffee) => (
          <div
            key={coffee._id}
            className="flex flex-col md:flex-row gap-1 items-center border justify-between"
          >
            <img
              className="size-30 aspect-square object-cover"
              src={coffee.image}
              alt=""
            />
            <div className="flex gap-2 mx-2">
              <p className="font-bold">{coffee.title}</p> - {coffee.type} -{" "}
              {coffee.price}₺
            </div>
            <div className="space-x-1 mx-2">
              <button
                onClick={() => setDeleteId(coffee._id!)}
                className="p-1 border text-red-500 cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(coffee)}
                className="p-1 border cursor-pointer"
              >
                Edit
              </button>
            </div>
            {deleteId === coffee._id && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                <div className="p-3 border bg-black">
                  <h2>
                    Are you sure you want to delete this coffee? This action is
                    irreversible
                  </h2>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setDeleteId("")}
                      className="p-1 border"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(coffee._id!)}
                      className="p-1 border text-red-500 cursor-pointer"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}

            {editId === coffee._id && (
              <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center">
                <AdminCoffeForm
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleEditSubmit}
                />
                <button onClick={() => setEditId("")} className="mt-5">
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center">
          <AdminCoffeForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleAddSubmit}
          />
          <button onClick={() => setIsOpen(false)} className="mt-5 border p-2">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminManageCoffees;
