import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Settings, Key } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';

export const APIKeyModal: React.FC = () => {
    const { apiKey, setApiKey, removeApiKey } = useHabits();
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(apiKey || '');

    const handleSave = () => {
        if (inputValue.trim()) {
            setApiKey(inputValue.trim());
            setOpen(false);
        }
    };

    const handleRemove = () => {
        removeApiKey();
        setInputValue('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-neutral-900 border-neutral-700 hover:bg-neutral-800">
                    <Settings className="w-5 h-5 text-neutral-400" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-emerald-400" />
                        Gemini API Configuration
                    </DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Enter your Gemini API key to enable AI-powered weekly insights. Your key is stored securely in your browser's local storage.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-4">
                    <Input
                        type="password"
                        placeholder="sk-..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-emerald-500"
                    />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    {apiKey && (
                        <Button variant="destructive" onClick={handleRemove}>
                            Remove Key
                        </Button>
                    )}
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                        Save Key
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
