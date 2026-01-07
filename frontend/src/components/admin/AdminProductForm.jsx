import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ---------------- Sortable Image ---------------- */

const SortableImage = ({ image }) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative cursor-grab active:cursor-grabbing"
    >
      <img
        src={image.preview}
        alt="preview"
        className="w-full h-32 object-cover rounded-md border"
      />
      <span className="absolute top-1 left-1 text-xs bg-black/70 text-white px-2 py-1 rounded">
        Drag
      </span>
    </div>
  );
};

/* ---------------- Main Component ---------------- */

export const AdminProductForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    price: "",
    stock: "",
  });

  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewSubCategory, setIsNewSubCategory] = useState(false);

  const [images, setImages] = useState([]);

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/home");
      return;
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Input Handlers ---------------- */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      if (value === "new") {
        setIsNewCategory(true);
        setIsNewSubCategory(true);
        setFormData({ ...formData, category: "", subCategory: "" });
      } else {
        setIsNewCategory(false);
        setIsNewSubCategory(false);
        setNewCategory("");
        setNewSubCategory("");
        setFormData({ ...formData, category: value, subCategory: "" });
      }
      return;
    }

    if (name === "subCategory") {
      if (value === "new") {
        setIsNewSubCategory(true);
        setFormData({ ...formData, subCategory: "" });
      } else {
        setIsNewSubCategory(false);
        setNewSubCategory("");
        setFormData({ ...formData, subCategory: value });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
    setFormData({ ...formData, category: e.target.value });
  };

  const handleNewSubCategoryChange = (e) => {
    setNewSubCategory(e.target.value);
    setFormData({ ...formData, subCategory: e.target.value });
  };

  /* ---------------- Image Logic ---------------- */

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length < 3 || files.length > 5) {
      setError("Please select between 3 and 5 images");
      return;
    }

    const mapped = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages(mapped);
    setError("");
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setImages((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const category = isNewCategory ? newCategory.trim() : formData.category;
    const subCategory = isNewSubCategory
      ? newSubCategory.trim()
      : formData.subCategory;

    if (!category || !subCategory) {
      setError("Category and Subcategory are required");
      setLoading(false);
      return;
    }

    if (images.length < 3 || images.length > 5) {
      setError("Please select between 3 and 5 images");
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();

      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("category", category);
      fd.append("subCategory", subCategory);
      fd.append("price", formData.price);
      fd.append("stock", formData.stock);

      // ORDER MATTERS
      images.forEach((img) => fd.append("images", img.file));

      const res = await apiClient.createProduct(fd);
      if (res.success) {
        alert("Product created successfully!");
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message || "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- JSX ---------------- */

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={isNewCategory ? "new" : formData.category}
                  onChange={handleInputChange}
                  required={!isNewCategory}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((catObj) => (
                    <option key={catObj.name} value={catObj.name}>
                      {catObj.name}
                    </option>
                  ))}
                  <option value="new">Add New Category</option>
                </select>
                {isNewCategory && (
                  <input
                    type="text"
                    name="newCategory"
                    placeholder="Enter new category name"
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    required
                    className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Sub Category
                </label>
                <select
                  name="subCategory"
                  value={isNewSubCategory ? "new" : formData.subCategory}
                  onChange={handleInputChange}
                  required={!isNewSubCategory}
                  disabled={!formData.category && !isNewCategory} // Disable if no category selected
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                >
                  <option value="">Select Sub Category</option>
                  {/* Populate subcats if category selected and not new */}
                  {!isNewCategory &&
                    formData.category &&
                    categories
                      .find((c) => c.name === formData.category)
                      ?.subCategories?.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  <option value="new">Add New Sub Category</option>
                </select>
                {isNewSubCategory && (
                  <input
                    type="text"
                    name="newSubCategory"
                    placeholder="Enter new sub category name"
                    value={newSubCategory}
                    onChange={handleNewSubCategoryChange}
                    required
                    className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Product Images (3-5 images required)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-sm text-gray-600 mt-1">
                Select between 3 and 5 images
              </p>
            </div>

            {/* {imagePreview.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                {imagePreview.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                  </div>
                ))}
              </div>
            )} */}

            
          </div>

          {/* ---------------- Images ---------------- */}

          <div className="mt-6">
            <label className="block font-semibold mb-2">
              Product Images (Drag to reorder)
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mb-4"
            />

            {images.length > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map((i) => i.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((img) => (
                      <SortableImage key={img.id} image={img} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 font-semibold"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
