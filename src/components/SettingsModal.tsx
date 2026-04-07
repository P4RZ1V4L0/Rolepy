import React from 'react';
import { X, ShieldAlert, Image as ImageIcon, Upload } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export interface AppSettings {
  nsfwEnabled: boolean;
  imageGenEnabled: boolean;
  imageUploadEnabled: boolean;
  customImageEndpoint: string;
  shortWritingEnabled: boolean;
}

export const defaultSettings: AppSettings = {
  nsfwEnabled: false,
  imageGenEnabled: false,
  imageUploadEnabled: false,
  customImageEndpoint: '',
  shortWritingEnabled: false,
};

interface SettingsModalProps {
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export function SettingsModal({ onClose, settings, onUpdateSettings }: SettingsModalProps) {
  const toggleSetting = (key: keyof AppSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center z-50">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="bg-[#1c1c1e] w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl border-t border-zinc-800 md:border border-zinc-800"
      >
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#1c1c1e]">
          <div className="w-10" /> {/* Spacer */}
          <h2 className="text-lg font-semibold text-white">Configuración</h2>
          <button onClick={onClose} className="text-[#0a84ff] font-medium px-2 py-1 hover:opacity-70 transition-opacity">
            Listo
          </button>
        </div>

        <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto bg-[#000000]">
          <div className="space-y-0.5 rounded-xl overflow-hidden">
            {/* NSFW Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#1c1c1e] border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                  <ShieldAlert size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-white">Modo NSFW (Sin Filtro)</p>
                  <p className="text-[11px] text-zinc-500">Desactiva los filtros de seguridad de la IA.</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('nsfwEnabled')}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative flex-shrink-0",
                  settings.nsfwEnabled ? "bg-[#34c759]" : "bg-[#39393d]"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform",
                  settings.nsfwEnabled ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>

            {/* Short Writing Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#1c1c1e] border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Upload size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-white">IA escribe Corto</p>
                  <p className="text-[11px] text-zinc-500">Respuestas más concisas y directas.</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('shortWritingEnabled')}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative flex-shrink-0",
                  settings.shortWritingEnabled ? "bg-[#34c759]" : "bg-[#39393d]"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform",
                  settings.shortWritingEnabled ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>

            {/* Image Upload Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#1c1c1e]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <ImageIcon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-white">Lector de Imágenes</p>
                  <p className="text-[11px] text-zinc-500">Permite enviar fotos para que la IA las vea.</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('imageUploadEnabled')}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative flex-shrink-0",
                  settings.imageUploadEnabled ? "bg-[#34c759]" : "bg-[#39393d]"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform",
                  settings.imageUploadEnabled ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>
          </div>

          <div className="space-y-0.5 rounded-xl overflow-hidden">
            {/* Image Generation Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#1c1c1e]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                  <ImageIcon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-white">Generación de Imágenes</p>
                  <p className="text-[11px] text-zinc-500">Permite crear imágenes con IA en el chat.</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('imageGenEnabled')}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative flex-shrink-0",
                  settings.imageGenEnabled ? "bg-[#34c759]" : "bg-[#39393d]"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform",
                  settings.imageGenEnabled ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>

            {/* Custom Image Endpoint */}
            {settings.imageGenEnabled && (
              <div className="p-4 bg-[#1c1c1e] border-t border-zinc-800/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Endpoint Personalizado</p>
                </div>
                <input
                  type="url"
                  value={settings.customImageEndpoint || ''}
                  onChange={(e) => onUpdateSettings({ ...settings, customImageEndpoint: e.target.value })}
                  placeholder="https://tu-api.com/generate"
                  className="w-full bg-[#2c2c2e] border-none rounded-lg px-4 py-2 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
