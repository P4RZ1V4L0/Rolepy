import React, { useState } from 'react';
import { db, type Character } from '../db';
import { User, Bot, Upload, X, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface CharacterFormProps {
  onClose: () => void;
  character?: Character;
}

export function CharacterForm({ onClose, character }: CharacterFormProps) {
  const [name, setName] = useState(character?.name || '');
  const [description, setDescription] = useState(character?.description || '');
  const [isAI, setIsAI] = useState(character?.isAI || false);
  const [systemPrompt, setSystemPrompt] = useState(character?.systemPrompt || '');
  const [icon, setIcon] = useState(character?.icon || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    const newCharacter: Character = {
      name,
      description,
      isAI,
      systemPrompt: isAI ? systemPrompt : undefined,
      icon,
    };

    if (character?.id) {
      await db.characters.update(character.id, newCharacter);
    } else {
      await db.characters.add(newCharacter);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center z-50">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="bg-[#1c1c1e] w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl border-t border-zinc-800 md:border border-zinc-800"
      >
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#1c1c1e]">
          <button onClick={onClose} className="text-[#0a84ff] font-medium px-2 py-1 hover:opacity-70 transition-opacity">
            Cancelar
          </button>
          <h2 className="text-lg font-semibold text-white">
            {character ? 'Editar Personaje' : 'Nuevo Personaje'}
          </h2>
          <button onClick={handleSave} className="text-[#0a84ff] font-bold px-2 py-1 hover:opacity-70 transition-opacity">
            Guardar
          </button>
        </div>

        <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto bg-[#000000]">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center overflow-hidden">
                {icon ? (
                  <img src={icon} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={40} className="text-zinc-600" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                <Upload size={24} className="text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-xs text-[#0a84ff] font-medium">Editar foto</p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#1c1c1e] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800/50">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-white focus:outline-none text-[16px]"
                  placeholder="Nombre"
                />
              </div>
              <div className="px-4 py-3">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-transparent text-white focus:outline-none text-[16px] min-h-[80px] resize-none"
                  placeholder="Descripción"
                />
              </div>
            </div>

            <div className="bg-[#1c1c1e] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                  <p className="text-[15px] font-medium text-white">Controlado por IA</p>
                </div>
                <button
                  onClick={() => setIsAI(!isAI)}
                  className={cn(
                    "w-12 h-7 rounded-full transition-colors relative flex-shrink-0",
                    isAI ? "bg-[#34c759]" : "bg-[#39393d]"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform",
                    isAI ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>

              {isAI && (
                <div className="p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Instrucciones de Personalidad</p>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="w-full bg-[#2c2c2e] border-none rounded-lg px-4 py-2 text-sm text-white focus:outline-none transition-all min-h-[120px] resize-none"
                    placeholder="Ej. Eres un anciano sabio y algo gruñón que habla en acertijos..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
