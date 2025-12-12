
import React, { useState } from 'react';
import { Calendar, Camera, Heart, Share2, Plus, Sparkles, Lock, Book, PenTool, Download } from 'lucide-react';
import { Memory, TimeCapsuleMessage } from '../types';
import { generateJournalEntry } from '../services/geminiService';

const MOCK_MEMORIES: Memory[] = [
  { id: '1', title: 'First Smile', date: '2023-11-15', description: 'Smiled at daddy during bath time!', imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&auto=format&fit=crop&q=60' },
  { id: '2', title: 'Started Rolling', date: '2024-01-20', description: 'Finally rolled from tummy to back.', imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&auto=format&fit=crop&q=60' },
  { id: '3', title: 'First Solid Food', date: '2024-03-10', description: 'Loved the avocado!', imageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=500&auto=format&fit=crop&q=60' },
];

const MOCK_CAPSULE: TimeCapsuleMessage[] = [
   { id: 'c1', title: 'For your 17th Birthday', content: '...', createdAt: new Date(), unlockDate: '2041-05-12', isLocked: true },
   { id: 'c2', title: 'On your wedding day', content: '...', createdAt: new Date(), unlockDate: '2050-01-01', isLocked: true },
];

const MemoryLane: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'journal' | 'capsule'>('journal');
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDailyJournal = async () => {
    setIsGenerating(true);
    const story = await generateJournalEntry('Arlo', [{id: '1', type: 'feed', timestamp: new Date()}, {id: '2', type: 'sleep', timestamp: new Date()}]);
    
    const newMemory: Memory = {
      id: Date.now().toString(),
      title: story.title,
      date: new Date().toISOString().split('T')[0],
      description: story.body,
      isAiGenerated: true
    };

    setMemories([newMemory, ...memories]);
    setIsGenerating(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-dark">Memory Lane</h2>
          <p className="text-gray-500">Your digital scrapbook.</p>
        </div>
        <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm w-full md:w-auto">
           <button 
             onClick={() => setActiveTab('journal')}
             className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'journal' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             Photos
           </button>
           <button 
             onClick={() => setActiveTab('capsule')}
             className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'capsule' ? 'bg-dark text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             Capsule
           </button>
        </div>
      </div>

      {activeTab === 'journal' ? (
        <>
          {/* Add New Memory Button */}
          <div className="grid grid-cols-2 gap-4 mb-6">
             <button className="bg-gray-100 hover:bg-gray-200 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 transition-all active:scale-95">
                <div className="bg-white p-3 rounded-full shadow-sm">
                   <Camera className="text-gray-600" size={24} />
                </div>
                <span className="font-bold text-gray-600 text-sm">Add Photo</span>
             </button>
             <button 
                onClick={handleGenerateDailyJournal}
                disabled={isGenerating}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 border border-indigo-100 transition-all active:scale-95"
             >
                <div className="bg-white p-3 rounded-full shadow-sm">
                   {isGenerating ? <Sparkles className="text-purple-500 animate-spin" size={24} /> : <PenTool className="text-purple-500" size={24} />}
                </div>
                <span className="font-bold text-purple-700 text-sm">{isGenerating ? 'Writing...' : 'AI Diary'}</span>
             </button>
          </div>

          {/* Masonry-ish Layout for Mobile */}
          <div className="space-y-6">
            {memories.map((mem, index) => (
              <div key={mem.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                 {/* Full Width Image */}
                 {mem.imageUrl && (
                   <div className="relative h-64 w-full bg-gray-200">
                     <img src={mem.imageUrl} alt={mem.title} className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                        <h3 className="text-white font-bold text-xl shadow-sm">{mem.title}</h3>
                        <div className="flex items-center gap-2 text-white/90 text-xs">
                           <Calendar size={12} /> {mem.date}
                        </div>
                     </div>
                     <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-500 hover:text-white transition-colors">
                        <Heart size={20} className={index === 0 ? "fill-red-500 text-red-500" : ""} />
                     </button>
                   </div>
                 )}
                 
                 <div className="p-5">
                    {!mem.imageUrl && (
                       <div className="mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{mem.title}</h3>
                          <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                             <Calendar size={12} /> {mem.date}
                          </div>
                       </div>
                    )}
                    <p className={`text-sm leading-relaxed ${mem.isAiGenerated ? 'text-indigo-900 italic bg-indigo-50 p-3 rounded-xl border border-indigo-100' : 'text-gray-600'}`}>
                       {mem.isAiGenerated && <Sparkles size={12} className="inline mr-1 text-indigo-400"/>}
                       "{mem.description}"
                    </p>
                 </div>
              </div>
            ))}
          </div>
          
          {/* End of List Hook */}
          <div className="text-center py-8">
             <p className="text-gray-400 text-sm">You've reached the start of Arlo's journey.</p>
             <div className="w-2 h-2 bg-gray-300 rounded-full mx-auto mt-2"></div>
          </div>
        </>
      ) : (
        <div className="space-y-6 animate-fade-in">
           <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-3xl flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-700 flex-shrink-0">
                 <Lock size={24} />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-yellow-900">Why Time Capsule?</h3>
                 <p className="text-yellow-800/80 text-sm mt-1">
                   Write letters to Arlo now, while the feelings are fresh. Set a date in the future (e.g., 18th Birthday). 
                   The app will <strong>lock</strong> these messages until that exact day.
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button className="aspect-square border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-white group-hover:shadow-md transition-colors">
                    <Plus size={24} />
                 </div>
                 <span className="font-bold text-sm">Write Letter</span>
              </button>

              {MOCK_CAPSULE.map(cap => (
                <div key={cap.id} className="aspect-square bg-white border border-gray-200 rounded-3xl p-4 relative overflow-hidden group hover:shadow-lg transition-shadow flex flex-col justify-between">
                   <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-100 rounded-full group-hover:bg-primary/10 transition-colors"></div>
                   <div className="relative z-10">
                      <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase mb-2">
                         <Lock size={10} /> {cap.unlockDate}
                      </div>
                      <h4 className="font-bold text-gray-800 leading-tight">{cap.title}</h4>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                       <div className="bg-gray-400 h-full w-[5%] rounded-full"></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default MemoryLane;
