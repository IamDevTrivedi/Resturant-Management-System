'use client';

import { useState, useEffect } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="inline-flex items-center rounded-full border border-border bg-background p-1">
            <Button
                variant={theme === 'system' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setTheme('system')}
                className="rounded-full h-6 w-6"
            >
                <Monitor className="h-4 w-4" />
                <span className="sr-only">System mode</span>
            </Button>
            <Button
                variant={theme === 'light' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setTheme('light')}
                className="rounded-full h-6 w-6"
            >
                <Sun className="h-4 w-4" />
                <span className="sr-only">Light mode</span>
            </Button>
            <Button
                variant={theme === 'dark' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setTheme('dark')}
                className="rounded-full h-6 w-6"
            >
                <Moon className="h-4 w-4" />
                <span className="sr-only">Dark mode</span>
            </Button>
        </div>
    );
}
