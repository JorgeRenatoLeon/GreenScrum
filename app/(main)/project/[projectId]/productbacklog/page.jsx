"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import useFetch from "@/hooks/use-fetch";
// import { getBacklogItems, updateBacklogItem, deleteBacklogItem } from "@/actions/backlog";

export default function ProductBacklog() {
//   const { data: backlogItems, fn: fetchBacklogItems } = useFetch(getBacklogItems);

  // Hardcoded backlog items for initial rendering
  const [backlogItems, setBacklogItems] = useState([
    {
      id: 1,
      title: "User Authentication",
      description: "Implement secure login/logout functionality.",
      actions: ["Login", "Signup"],
      sustainability: ["Technology", "Security"],
      priority: "High",
    },
    {
      id: 2,
      title: "Dark Mode Support",
      description: "Provide a toggle for dark mode.",
      actions: ["UI", "Accessibility"],
      sustainability: ["Individual", "Technology"],
      priority: "Medium",
    },
  ]);
//   const { fn: updateItem } = useFetch(updateBacklogItem);
//   const { fn: deleteItem } = useFetch(deleteBacklogItem);

  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

//   useEffect(() => {
//     fetchBacklogItems();
//   }, []);

//   const handleEdit = (item) => {
//     setEditingItem(item.id);
//     setFormData({ ...item });
//   };

//   const handleSave = async () => {
//     await updateItem(formData.id, formData);
//     toast.success("Item updated successfully");
//     setEditingItem(null);
//     fetchBacklogItems();
//   };

//   const handleDelete = async (id) => {
//     if (confirm("Are you sure you want to delete this item?")) {
//       await deleteItem(id);
//       toast.success("Item deleted successfully");
//       fetchBacklogItems();
//     }
//   };



  const handleEdit = (item) => {
    setEditingItem(item.id);
    setFormData({ ...item });
  };

  const handleSave = () => {
    setBacklogItems((prevItems) =>
      prevItems.map((item) => (item.id === formData.id ? formData : item))
    );
    toast.success("Item updated successfully");
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setBacklogItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast.success("Item deleted successfully");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Backlog</h1>
      {backlogItems?.length === 0 ? (
        <p>No backlog items available.</p>
      ) : (
        backlogItems.map((item) => (
          <Card key={item.id} className="mb-4">
            <CardContent className="flex flex-col gap-4">
              {editingItem === item.id ? (
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              ) : (
                <h3 className="text-lg font-semibold">{item.title}</h3>
              )}

              {editingItem === item.id ? (
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              ) : (
                <p className="text-gray-400">{item.description}</p>
              )}

              <div className="flex gap-2">
                {item.actions.map((action, index) => (
                  <Badge key={index}>{action}</Badge>
                ))}
              </div>

              <div className="flex gap-2">
                {item.sustainability.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>

              <p className="text-sm">Priority: {item.priority}</p>

              <div className="flex justify-end gap-2">
                {editingItem === item.id ? (
                  <Button onClick={handleSave}>Save</Button>
                ) : (
                  <Button onClick={() => handleEdit(item)} variant="outline">
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                <Button onClick={() => handleDelete(item.id)} variant="destructive">
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
