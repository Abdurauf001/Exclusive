import { get, post, put, del } from "./client";

export const resources = {
  users: {
    label: "Users",
    basePath: "/api/users",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
    ],
  },
  checkouts: {
    label: "Checkouts",
    basePath: "/api/checkouts",
    fields: [
      { name: "firstName", label: "First Name", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "city", label: "City", type: "text", required: true },
      { name: "paymentMethod", label: "Payment", type: "text", required: true },
      { name: "total", label: "Total", type: "number", required: true },
      { name: "status", label: "Status", type: "text" },
    ],
  },
  savat: {
    label: "Savat",
    basePath: "/api/savat",
    fields: [
      { name: "userId", label: "User ID", type: "number" },
      { name: "productId", label: "Product ID", type: "text" },
      { name: "itemName", label: "Item Name", type: "text", required: true },
      { name: "quantity", label: "Quantity", type: "number" },
      { name: "unitPrice", label: "Unit Price", type: "number" },
    ],
  },
  likes: {
    label: "Likes",
    basePath: "/api/likes",
    fields: [
      { name: "userId", label: "User ID", type: "number" },
      { name: "targetType", label: "Target Type", type: "text", required: true },
      { name: "targetId", label: "Target ID", type: "number", required: true },
    ],
  },
  contacts: {
    label: "Contacts",
    basePath: "/api/contacts",
    fields: [
      { name: "userId", label: "User ID", type: "number" },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      { name: "subject", label: "Subject", type: "text", required: true },
      { name: "phone", label: "Phone", type: "text" },
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
  },
  cards: {
    label: "Cards",
    basePath: "/api/cards",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "imageUrl", label: "Image", type: "text", required: true },
      { name: "price", label: "Price", type: "number", required: true },
    ],
  },
};

export async function listItems(resource) {
  return get(resource.basePath);
}

export async function getItem(resource, id) {
  return get(`${resource.basePath}/${id}`);
}

export async function createItem(resource, payload) {
  return post(resource.basePath, payload);
}

export async function updateItem(resource, id, payload) {
  return put(`${resource.basePath}/${id}`, payload);
}

export async function deleteItem(resource, id) {
  return del(`${resource.basePath}/${id}`);
}
