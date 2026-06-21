"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/lib/actions/categories";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  _count: { courses: number };
};

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setIsAdding(true);
    
    const res = await createCategoryAction(newName);
    if (res?.error) {
      toast.error(res.error);
    } else if (res?.success && res.category) {
      toast.success("Category created!");
      setCategories([...categories, { ...res.category, _count: { courses: 0 } }]);
      setNewName("");
    }
    
    setIsAdding(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    
    const res = await updateCategoryAction(id, editName);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Category updated!");
      setCategories(categories.map(c => c.id === id ? { ...c, name: editName.trim(), slug: editName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") } : c));
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    const res = await deleteCategoryAction(id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Category deleted!");
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="space-y-2 flex-1">
          <label htmlFor="newName" className="text-sm font-medium">New Category Name</label>
          <Input 
            id="newName" 
            placeholder="e.g. Web Development" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="bg-transparent"
          />
        </div>
        <Button onClick={handleAdd} disabled={isAdding || !newName.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No categories found. Add your first category above.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((category) => (
              <div key={category.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                {editingId === category.id ? (
                  <div className="flex items-center gap-3 flex-1">
                    <Input 
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate(category.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="bg-background max-w-sm"
                    />
                    <Button size="icon" variant="ghost" onClick={() => handleUpdate(category.id)}>
                      <Check className="h-4 w-4 text-emerald-500" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium text-foreground">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">/{category.slug} • {category._count.courses} courses</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => {
                          setEditName(category.name);
                          setEditingId(category.id);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(category.id)}
                        disabled={category._count.courses > 0}
                        title={category._count.courses > 0 ? "Cannot delete category with active courses" : "Delete category"}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
