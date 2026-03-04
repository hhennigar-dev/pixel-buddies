import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import Avatar from './Avatar';
import { AvatarConfig } from '../types';

interface AvatarBuilderProps {
  initialConfig: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
  saveLabel?: string;
  theme?: 'light' | 'dark';
}

const AvatarBuilder: React.FC<AvatarBuilderProps> = ({ initialConfig, onSave, saveLabel = "Save Avatar", theme = 'light' }) => {
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(initialConfig);
  const [avatarTab, setAvatarTab] = useState<'skin'|'hair'|'eyes'|'mouth'|'clothes'|'headwear'>('skin');

  useEffect(() => {
    setAvatarConfig(initialConfig);
  }, [initialConfig]);

  const skinColors = ['#FCD5B5', '#EAC096', '#D6A674', '#C68642', '#8D5524', '#5D3618', '#3E230D', '#FFC1C1'];
  const hairColors = ['#000000', '#4B2816', '#744621', '#B67B38', '#E6C176', '#881818', '#CCCCCC', '#FFFFFF'];
  const clothColors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#111827', '#FFFFFF'];
  const headwearColors = ['#EF4444', '#3B82F6', '#10B981', '#1f2937', '#F59E0B', '#FFFFFF'];

  return (
    <div className={`flex-1 w-full flex flex-col md:flex-row gap-6 h-full ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Preview */}
      <div className={`flex-1 border-2 rounded-3xl flex items-center justify-center p-8 relative overflow-hidden shadow-inner ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <Avatar config={avatarConfig} size="xl" className="z-10" allowOverflow />
      </div>

      {/* Controls */}
      <div className={`flex-1 border-2 rounded-3xl p-6 flex flex-col max-h-[600px] shadow-sm ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        {/* Tabs */}
        <div className={`flex space-x-1 mb-6 p-1 rounded-xl overflow-x-auto no-scrollbar ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
          {(['skin', 'hair', 'headwear', 'eyes', 'mouth', 'clothes'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setAvatarTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-all
                ${avatarTab === tab 
                  ? (theme === 'dark' ? 'bg-gray-700 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm') 
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {avatarTab === 'skin' && (
            <div className="grid grid-cols-4 gap-4">
               {skinColors.map(c => (
                 <button 
                   key={c} 
                   onClick={() => setAvatarConfig({...avatarConfig, skinColor: c})} 
                   className={`w-full aspect-square rounded-full border-4 transition-all ${avatarConfig.skinColor === c ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'}`} 
                   style={{backgroundColor: c}} 
                 />
               ))}
            </div>
          )}
          
          {avatarTab === 'hair' && (
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Style</p>
                      <button 
                        onClick={() => setAvatarConfig({...avatarConfig, flipHair: !avatarConfig.flipHair})} 
                        className="text-xs text-blue-500 font-bold hover:text-blue-600 flex items-center space-x-1"
                      >
                         <RefreshCw className="w-3 h-3" /> <span>Flip</span>
                      </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                      {['none', 'short', 'spiky', 'bun', 'ponytail', 'sidepart', 'curly', 'afro', 'buzz', 'wavy', 'braids'].map(s => (
                        <button 
                          key={s} 
                          onClick={() => setAvatarConfig({...avatarConfig, hairStyle: s as any})} 
                          className={`py-3 px-2 rounded-xl border-2 text-xs font-bold capitalize transition-all ${
                            avatarConfig.hairStyle === s 
                              ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                              : (theme === 'dark' ? 'border-gray-800 text-gray-400 hover:border-gray-700' : 'border-gray-100 text-gray-600 hover:border-gray-200')
                          }`}>
                          {s}
                        </button>
                      ))}
                  </div>
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Color</p>
                   <div className="grid grid-cols-4 gap-4">
                      {hairColors.map(c => (
                        <button 
                          key={c} 
                          onClick={() => setAvatarConfig({...avatarConfig, hairColor: c})} 
                          className={`w-full aspect-square rounded-full border-4 transition-all ${avatarConfig.hairColor === c ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'}`} 
                          style={{backgroundColor: c}} 
                        />
                      ))}
                   </div>
                </div>
             </div>
          )}

          {avatarTab === 'headwear' && (
             <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Type</p>
                  <div className="grid grid-cols-2 gap-2">
                      {['none', 'cap', 'beanie', 'bandana'].map(s => (
                        <button 
                          key={s} 
                          onClick={() => setAvatarConfig({...avatarConfig, headwear: s as any})} 
                          className={`py-3 px-2 rounded-xl border-2 text-xs font-bold capitalize transition-all ${
                            avatarConfig.headwear === s 
                              ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                              : (theme === 'dark' ? 'border-gray-800 text-gray-400 hover:border-gray-700' : 'border-gray-100 text-gray-600 hover:border-gray-200')
                          }`}>
                          {s}
                        </button>
                      ))}
                  </div>
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Color</p>
                   <div className="grid grid-cols-4 gap-4">
                      {headwearColors.map(c => (
                        <button 
                          key={c} 
                          onClick={() => setAvatarConfig({...avatarConfig, headwearColor: c})} 
                          className={`w-full aspect-square rounded-full border-4 transition-all ${avatarConfig.headwearColor === c ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'}`} 
                          style={{backgroundColor: c}} 
                        />
                      ))}
                   </div>
                </div>
             </div>
          )}

          {avatarTab === 'eyes' && (
              <div className="grid grid-cols-2 gap-3">
                  {['normal', 'happy', 'glasses', 'sunglasses'].map(e => (
                      <button 
                        key={e} 
                        onClick={() => setAvatarConfig({...avatarConfig, eyeType: e as any})} 
                        className={`py-4 rounded-2xl border-2 capitalize font-bold transition-all ${
                          avatarConfig.eyeType === e 
                            ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                            : (theme === 'dark' ? 'border-gray-800 text-gray-400 hover:border-gray-700' : 'border-gray-100 text-gray-600 hover:border-gray-200')
                        }`}>
                        {e}
                      </button>
                  ))}
              </div>
          )}

          {avatarTab === 'mouth' && (
              <div className="grid grid-cols-2 gap-3">
                  {['smile', 'grin', 'neutral', 'open'].map(m => (
                      <button 
                        key={m} 
                        onClick={() => setAvatarConfig({...avatarConfig, mouthType: m as any})} 
                        className={`py-4 rounded-2xl border-2 capitalize font-bold transition-all ${
                          avatarConfig.mouthType === m 
                            ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                            : (theme === 'dark' ? 'border-gray-800 text-gray-400 hover:border-gray-700' : 'border-gray-100 text-gray-600 hover:border-gray-200')
                        }`}>
                        {m}
                      </button>
                  ))}
              </div>
          )}

          {avatarTab === 'clothes' && (
             <div className="grid grid-cols-4 gap-4">
               {clothColors.map(c => (
                 <button 
                   key={c} 
                   onClick={() => setAvatarConfig({...avatarConfig, clothingColor: c})} 
                   className={`w-full aspect-square rounded-full border-4 transition-all ${avatarConfig.clothingColor === c ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'}`} 
                   style={{backgroundColor: c}} 
                 />
               ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={() => onSave(avatarConfig)}
          className="w-full mt-6 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-2xl uppercase tracking-wider shadow-[0_4px_0_0_#22c55e] active:translate-y-1 active:shadow-none transition-all"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
};

export default AvatarBuilder;
