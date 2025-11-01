import { Sparkles } from 'lucide-react';
import React from 'react';

export function Logo() {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 border-2 border-primary/20 shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
    );
}
