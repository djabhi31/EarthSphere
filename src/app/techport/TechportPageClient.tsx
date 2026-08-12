'use client';

import { useState } from 'react';
import { useTechportProjects, useTechportProject } from '@/hooks/useNasaApi';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Search, Database, ChevronRight, X, ExternalLink, Calendar, Briefcase, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TechportProject } from '@/lib/types/nasa';

// Component for fetching and displaying a single project detail inside a modal
function ProjectDetailModal({ projectId, onClose }: { projectId: number, onClose: () => void }) {
  const { data, isLoading, isError } = useTechportProject(projectId);

  // Prevent scroll when modal is open
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }

  const handleClose = () => {
    document.body.style.overflow = 'auto';
    onClose();
  };

  const project = data?.project;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] glass rounded-2xl border border-[var(--aurora-mint)]/30 overflow-hidden flex flex-col bg-[#0a0f16]"
      >
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/80 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {isLoading && (
          <div className="p-12 flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-4 border-[var(--aurora-mint)]/30 border-t-[var(--aurora-mint)] rounded-full animate-spin"></div>
            <p className="text-[var(--text-secondary)]">Loading project data...</p>
          </div>
        )}

        {isError && (
          <div className="p-12 flex flex-col items-center justify-center h-64 text-center">
            <Database size={48} className="text-red-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Failed to load project</h3>
            <p className="text-[var(--text-secondary)]">The requested project data could not be found or retrieved.</p>
          </div>
        )}

        {project && (
          <div className="overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
            <div className="pr-12">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--aurora-mint)]/10 text-[var(--aurora-mint)] border border-[var(--aurora-mint)]/20 uppercase tracking-wider">
                  {project.statusDescription || 'Unknown Status'}
                </span>
                <span className="text-sm font-mono text-[var(--text-tertiary)]">ID: {project.projectId}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">{project.title}</h2>
              {project.acronym && (
                <p className="text-xl text-[var(--text-secondary)] font-medium">({project.acronym})</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="glass-subtle p-4 rounded-xl border border-white/5 flex items-start gap-3">
                 <Calendar className="text-[var(--aurora-mint)] shrink-0 mt-0.5" size={20} />
                 <div>
                   <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Timeline</div>
                   <div className="font-medium text-sm mt-1">
                     {project.startDateString || 'TBD'} — {project.endDateString || 'TBD'}
                   </div>
                 </div>
               </div>
               
               <div className="glass-subtle p-4 rounded-xl border border-white/5 flex items-start gap-3">
                 <Cpu className="text-[var(--aurora-mint)] shrink-0 mt-0.5" size={20} />
                 <div>
                   <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Readiness (TRL)</div>
                   <div className="font-medium text-sm mt-1">
                     Start: {project.startTrl || '?'} → Current: {project.currentTrl || '?'} → End: {project.endTrl || '?'}
                   </div>
                 </div>
               </div>

               <div className="glass-subtle p-4 rounded-xl border border-white/5 flex items-start gap-3">
                 <Briefcase className="text-[var(--aurora-mint)] shrink-0 mt-0.5" size={20} />
                 <div>
                   <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Program</div>
                   <div className="font-medium text-sm mt-1 line-clamp-2">
                     {project.responsibleProgram || 'N/A'}
                   </div>
                 </div>
               </div>
            </div>

            {project.description && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Description</h3>
                <div 
                  className="prose prose-invert max-w-none text-[var(--text-secondary)] prose-a:text-[var(--aurora-mint)] prose-headings:text-white"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
            )}

            {project.benefits && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Benefits</h3>
                <div 
                  className="prose prose-invert max-w-none text-[var(--text-secondary)] prose-a:text-[var(--aurora-mint)] prose-headings:text-white"
                  dangerouslySetInnerHTML={{ __html: project.benefits }}
                />
              </div>
            )}
            
            {project.website && (
              <div className="pt-4 border-t border-white/10">
                <a 
                  href={project.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--aurora-mint)] hover:text-white transition-colors"
                >
                  <ExternalLink size={18} />
                  <span>Visit Project Website</span>
                </a>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function TechportPageClient() {
  const { data: listData, isLoading: listLoading } = useTechportProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(searchInput);
    if (!isNaN(id) && id > 0) {
      setSelectedProjectId(id);
    }
  };

  // Get latest 20 projects (assuming descending order by lastUpdated in the API)
  const recentProjects = listData?.projects?.slice(0, 20) || [];

  return (
    <div className="ep-container pb-20">
      <div className="ep-section pt-24 md:pt-32 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-16 h-16 bg-[var(--aurora-mint)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--aurora-mint)]/20 shadow-[0_0_30px_rgba(var(--aurora-mint-rgb),0.2)]">
            <Rocket className="text-[var(--aurora-mint)]" size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            NASA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--aurora-mint)] to-emerald-400">Techport</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
            Explore NASA's Technology Portfolio. Discover innovative projects, missions, and research driving the future of space exploration.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--aurora-mint)]/30 text-[var(--aurora-mint)] mb-10">
            <Database size={18} />
            <span className="font-semibold">{listData?.totalCount ? listData.totalCount.toLocaleString() : '---'}</span>
            <span className="text-white/70">Total Projects Tracked</span>
          </div>

          <form onSubmit={handleSearch} className="relative max-w-md mx-auto mb-16">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-[var(--text-tertiary)]" size={20} />
            </div>
            <input
              type="number"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Project ID..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-24 focus:outline-none focus:ring-2 focus:ring-[var(--aurora-mint)]/50 focus:border-transparent transition-all"
            />
            <button 
              type="submit"
              disabled={!searchInput}
              className="absolute inset-y-1.5 right-1.5 px-4 bg-[var(--aurora-mint)]/20 text-[var(--aurora-mint)] font-medium rounded-lg hover:bg-[var(--aurora-mint)]/30 transition-colors disabled:opacity-50"
            >
              Load
            </button>
          </form>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recently Updated Projects</h2>
            {listLoading && (
              <div className="text-sm text-[var(--text-secondary)] animate-pulse">Loading list...</div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {listLoading ? (
              Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-4 h-24 animate-pulse bg-white/5 border border-white/10" />
              ))
            ) : (
              recentProjects.map((p) => (
                <button
                  key={p.projectId}
                  onClick={() => setSelectedProjectId(p.projectId)}
                  className="glass rounded-xl p-4 text-left border border-white/10 hover:border-[var(--aurora-mint)]/50 transition-all hover:-translate-y-1 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--aurora-mint)]/5 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-[var(--aurora-mint)]/20 transition-colors" />
                  
                  <div className="text-xs text-[var(--text-tertiary)] mb-1">ID: {p.projectId}</div>
                  <div className="text-sm font-medium text-[var(--text-secondary)] truncate">
                    Updated: {p.lastUpdated}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[var(--aurora-mint)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-semibold uppercase tracking-wider">Load</span>
                    <ChevronRight size={16} />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProjectId && (
          <ProjectDetailModal 
            projectId={selectedProjectId} 
            onClose={() => setSelectedProjectId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
