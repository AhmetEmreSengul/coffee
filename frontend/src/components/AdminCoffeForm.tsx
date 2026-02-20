import type { FormEvent } from "react";

interface CoffeeFormProps {
  handleSubmit: (e: FormEvent) => void;
  formData: {
    title: string;
    type: string;
    price: number;
    image: string;
    description: string;
  };
  setFormData: (data: any) => void;
}

const AdminCoffeForm = ({
  handleSubmit,
  formData,
  setFormData,
}: CoffeeFormProps) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 border p-2 bg-black max-w-lg container"
    >
      <label>Title</label>
      <input
        className="border p-2"
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <label>Type</label>
      <select
        value={formData.type}
        className="p-3 bg-black"
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        required
      >
        <option value="">Select Type</option>
        <option value="Hot">Hot</option>
        <option value="Cold">Cold</option>
      </select>
      <label>Price</label>
      <input
        className="border p-2"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) =>
          setFormData({
            ...formData,
            price: Number(e.target.value),
          })
        }
        required
      />
      <label>Image Url</label>
      <input
        className="border p-2"
        type="url"
        placeholder="Image"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        required
      />
      {formData.image && (
        <img
          className="size-25 aspect-square object-cover"
          src={formData.image}
          alt=""
        />
      )}
      <label>Description</label>
      <textarea
        className="border p-2"
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AdminCoffeForm;
