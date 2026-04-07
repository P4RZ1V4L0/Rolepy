import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Character } from '../db';
import { Plus, User, Bot, Settings, Trash2, Edit2, MessageSquare } from 'lucide-react';
import { CharacterForm } from './CharacterForm';
import { ConfirmModal } from './ConfirmModal';
import { CharacterProfileModal } from './CharacterProfileModal';
import { cn } from '../lib/utils';

interface SidebarProps {
  selectedCharacterId?: number;
  onSelectCharacter: (id: number) => void;
  onOpenSettings: () => void;
}

export function Sidebar({ selectedCharacterId, onSelectCharacter, onOpenSettings }: SidebarProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | undefined>();
  const [characterToDelete, setCharacterToDelete] = useState<number | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Character | null>(null);

  const characters = useLiveQuery(() => db.characters.toArray());

  const handleEdit = (e: React.MouseEvent, char: Character) => {
    e.stopPropagation();
    setEditingCharacter(char);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setCharacterToDelete(id);
  };

  const confirmDelete = async () => {
    if (characterToDelete !== null) {
      await db.characters.delete(characterToDelete);
      await db.messages.where('characterId').equals(characterToDelete).delete();
      setCharacterToDelete(null);
    }
  };

  return (
    <div className="w-full h-full bg-[#0b141a] flex flex-col border-r border-zinc-800/50">
      <div className="p-4 flex items-center justify-between bg-[#0b141a] sticky top-0 z-10">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <MessageSquare className="text-[#00a884]" />
          Roleplay
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="p-2 text-[#8696a0] hover:text-[#00a884] transition-colors"
            title="Configuración"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => {
              setEditingCharacter(undefined);
              setIsFormOpen(true);
            }}
            className="p-2 bg-[#00a884] hover:bg-[#06cf9c] text-[#0b141a] rounded-full transition-all shadow-lg"
            title="Nuevo Personaje"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {characters?.length === 0 ? (
          <div className="text-center py-10 px-4">
            <User size={40} className="mx-auto text-zinc-700 mb-3" />
            <p className="text-sm text-zinc-500">No hay personajes aún. ¡Crea uno para empezar!</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {characters?.map((char) => (
              <div
                key={char.id}
                onClick={() => onSelectCharacter(char.id!)}
                className={cn(
                  "group relative flex items-center gap-3 p-4 cursor-pointer transition-all",
                  selectedCharacterId === char.id
                    ? "bg-[#2a3942]"
                    : "bg-transparent hover:bg-[#202c33]"
                )}
              >
                <div 
                  className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700/50 overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-[#00a884]/50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewingProfile(char);
                  }}
                >
                  {char.icon ? (
                    <img src={char.icon} alt={char.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={24} className="text-zinc-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-[15px] font-medium text-[#e9edef] truncate flex items-center gap-1.5">
                      {char.name}
                      {char.isAI && <Bot size={14} className="text-[#00a884]" />}
                    </p>
                  </div>
                  <p className="text-[13px] text-[#8696a0] truncate mt-0.5">{char.description}</p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEdit(e, char)}
                    className="p-1.5 hover:bg-zinc-700/50 rounded-full text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, char.id!)}
                    className="p-1.5 hover:bg-red-900/20 rounded-full text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div 
          onClick={onOpenSettings}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-100"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Configuración</span>
        </div>
      </div>

      {isFormOpen && (
        <CharacterForm
          onClose={() => setIsFormOpen(false)}
          character={editingCharacter}
        />
      )}

      {characterToDelete !== null && (
        <ConfirmModal
          title="Eliminar Personaje"
          message="¿Estás seguro de que quieres eliminar este personaje y todo su historial de chat? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          onConfirm={confirmDelete}
          onCancel={() => setCharacterToDelete(null)}
        />
      )}

      {viewingProfile && (
        <CharacterProfileModal
          character={viewingProfile}
          onClose={() => setViewingProfile(null)}
        />
      )}
    </div>
  );
}
