
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStrategies } from "@/hooks/use-strategies";
import AnimatedList from "../ui/animated-list";
import { cn } from "@/lib/utils";

export function AddStrategyDialog() {
  const { strategies, addStrategy, deleteStrategy, isLoaded } = useStrategies();
  const [open, setOpen] = useState(false);
  const [newStrategy, setNewStrategy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAdd = async () => {
    const trimmedStrategy = newStrategy.trim();
    if (!trimmedStrategy) {
        toast({
            variant: "destructive",
            title: "Invalid Strategy Name",
            description: "Strategy name cannot be empty.",
        });
        return;
    }

    setIsLoading(true);
    const success = await addStrategy(trimmedStrategy);
    if (success) {
      setNewStrategy("");
    }
    setIsLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, strategy: string) => {
    e.stopPropagation();
    setIsLoading(true);
    await deleteStrategy(strategy);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Add or manage strategies</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Strategies</DialogTitle>
          <DialogDescription>
            Add and view your tracked strategies.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <h4 className="font-medium text-sm">Existing Strategies</h4>
             <AnimatedList
                items={strategies}
                renderItem={(strategy, index, isSelected) => (
                    <div className={cn("item", isSelected && "selected")}>
                        <p className="item-text">{strategy}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={(e) => handleDelete(e, strategy)}
                            disabled={isLoading}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
             />
        </div>
        <div className="grid gap-2">
            <h4 className="font-medium text-sm">Add New Strategy</h4>
            <div className="flex w-full items-center space-x-2">
                <Input
                  id="strategy-name"
                  value={newStrategy}
                  onChange={(e) => setNewStrategy(e.target.value)}
                  placeholder="e.g. London Killzone"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAdd();
                    }
                  }}
                />
                <Button onClick={handleAdd} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Strategy
                </Button>
            </div>
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
