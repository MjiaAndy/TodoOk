// components/shared/UserProfile.tsx - VERSIÓN FINAL Y MEJORADA
'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import { LogOut, Settings, User, LifeBuoy, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup, 
} from '@/components/ui/DropdownMenu';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-2 h-[48px]">
        <Loader2 className="h-5 w-5 animate-spin text-foreground-alt" />
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    return <Button onClick={() => signIn()} className="w-full">Iniciar Sesión</Button>;
  }

  const { user } = session;
  const userInitials = user.name?.split(' ').map(n => n[0]).join('') || '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center w-full gap-3 p-2 rounded-lg transition-colors hover:bg-white/10">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ''} alt={user.name || ''} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start truncate">
            <span className="text-sm font-semibold text-foreground-strong truncate">
              Hola, {user.name?.split(' ')[0]}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" side="right" align="start">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground-strong">{user.name}</p>
            <p className="text-xs leading-none text-foreground-alt">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mi Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Ajustes</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Soporte</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer text-danger hover:bg-danger hover:text-white focus:bg-danger/90 focus:text-white">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}