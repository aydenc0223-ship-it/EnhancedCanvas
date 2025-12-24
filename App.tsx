import React, { useState, useMemo } from 'react';
import { parseICS } from './utils/icsParser';
import { Assignment, FetchStatus } from './types';
import { AssignmentCard } from './components/AssignmentCard';
import { IconCalendar, IconUpload, IconSparkles } from './components/Icons';
import { GlassCard } from './components/GlassCard';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';

export default function App() {
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [activeCourses, setActiveCourses] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Chat State
  const [view, setView] = useState<'dashboard' | 'chat'>('dashboard');
  const [chatAssignment, setChatAssignment] = useState<Assignment | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const content = await file.text();
      
      if (!content.includes('BEGIN:VCALENDAR')) {
        throw new Error("Invalid ICS file format.");
      }

      const parsedEvents = parseICS(content);
      
      // Extract unique courses from ALL events (past and future)
      const uniqueCourses = Array.from(new Set(parsedEvents.map(e => e.course))).sort();
      
      setAllAssignments(parsedEvents);
      setCourses(uniqueCourses);
      setActiveCourses(uniqueCourses); // Enable all by default
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg("Could not parse the calendar file. Please ensure it is a valid .ics export.");
    }
  };

  const handleToggleCourse = (course: string) => {
    setActiveCourses(prev => 
      prev.includes(course) 
        ? prev.filter(c => c !== course)
        : [...prev, course]
    );
  };

  const handleToggleAll = (enable: boolean) => {
    setActiveCourses(enable ? courses : []);
  };

  const handleStartChat = (assignment: Assignment) => {
    setChatAssignment(assignment);
    setView('chat');
  };

  const handleBackFromChat = () => {
    setChatAssignment(null);
    setView('dashboard');
  };

  // Filter assignments for display
  const visibleAssignments = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return allAssignments.filter(a => {
      // 1. Must be today or future
      if (a.startDate < now) return false;
      // 2. Must be in active courses
      if (!activeCourses.includes(a.course)) return false;
      return true;
    });
  }, [allAssignments, activeCourses]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#0f172a] text-white font-sans selection:bg-pink-500 selection:text-white">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600 rounded-full blur-[120px] opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-indigo-600 rounded-full blur-[100px] opacity-30"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        
        {view === 'chat' && chatAssignment ? (
           <ChatInterface 
             assignment={chatAssignment} 
             onBack={handleBackFromChat} 
           />
        ) : (
          <>
            {/* Header */}
            <header className={`mb-10 text-center transition-all duration-500 ${status === 'success' ? 'md:text-left md:mb-8 md:flex md:items-center md:justify-between' : ''}`}>
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
                <IconCalendar className="w-8 h-8 text-pink-400 mr-2" />
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                  GlassPlanner
                </h1>
              </div>
              {status !== 'success' && (
                <p className="text-white/60 text-sm max-w-md mx-auto mt-4">
                  Transform your Canvas calendar export into a crystal clear, AI-powered task list.
                </p>
              )}
              {status === 'success' && (
                <button 
                  onClick={() => { setStatus('idle'); setAllAssignments([]); setCourses([]); }}
                  className="mt-4 md:mt-0 text-xs text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/5"
                >
                  Upload New File
                </button>
              )}
            </header>

            {/* Input Section (Hidden if Success) */}
            {status !== 'success' && (
              <div className="max-w-xl mx-auto">
                <GlassCard className="p-6 mb-8 transform transition-all hover:scale-[1.01]">
                  <label className="block text-sm font-medium text-white/80 mb-4 pl-1">
                    Upload Calendar File (.ics)
                  </label>
                  
                  <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 transition-all hover:bg-white/5 hover:border-pink-500/50 group text-center cursor-pointer overflow-hidden">
                      <input 
                          type="file" 
                          accept=".ics"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`flex flex-col items-center justify-center space-y-3 transition-opacity duration-300 ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}>
                          <div className="p-3 bg-white/10 rounded-full group-hover:bg-pink-500/20 transition-colors">
                              <IconUpload className="w-6 h-6 text-pink-300" />
                          </div>
                          <div>
                              <p className="font-medium text-white/90">Click to upload or drag & drop</p>
                              <p className="text-sm text-white/50 mt-1">Accepts .ics files from Canvas</p>
                          </div>
                      </div>

                      {status === 'loading' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex flex-col items-center">
                            <IconSparkles className="w-6 h-6 text-purple-400 animate-spin mb-2" />
                            <span className="text-sm text-purple-200">Analyzing Schedule...</span>
                          </div>
                        </div>
                      )}
                  </div>

                  {status === 'error' && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-center animate-in fade-in slide-in-from-top-2">
                      <span className="mr-2">⚠️</span> {errorMsg}
                    </div>
                  )}
                  
                  <div className="mt-6 text-xs text-white/40">
                    <p className="font-semibold mb-1">How to get your Canvas File:</p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      <li>Go to Canvas Calendar.</li>
                      <li>Click "Calendar Feed" at the bottom right.</li>
                      <li><strong>Click the link</strong> in the modal to download the .ics file to your device.</li>
                      <li>Upload that file here.</li>
                    </ol>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Results Section - 2 Column Layout */}
            {status === 'success' && (
              <div className="flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 items-start">
                
                {/* Sidebar Column */}
                <div className="md:w-auto md:min-w-[220px] md:max-w-sm flex-shrink-0 w-full">
                  <div className="sticky top-6">
                    <Sidebar 
                        allCourses={courses} 
                        activeCourses={activeCourses} 
                        onToggleCourse={handleToggleCourse}
                        onToggleAll={handleToggleAll}
                    />
                  </div>
                </div>

                {/* Main Content Column */}
                <div className="flex-1 min-w-0 w-full">
                  {visibleAssignments.length === 0 ? (
                    <GlassCard className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <IconCalendar className="w-8 h-8 text-white/20" />
                      </div>
                      <p className="text-xl text-white/80 font-medium">No assignments visible</p>
                      <p className="text-white/50 text-sm mt-2 max-w-xs mx-auto">
                        {activeCourses.length === 0 
                            ? "Select a class from the sidebar to see assignments." 
                            : "You are all caught up for the selected classes!"}
                      </p>
                    </GlassCard>
                  ) : (
                    <div className="space-y-4">
                      {visibleAssignments.map(assignment => (
                        <AssignmentCard 
                          key={assignment.id} 
                          assignment={assignment}
                          onStartChat={handleStartChat}
                        />
                      ))}
                      
                      <div className="text-center py-8">
                        <p className="text-white/30 text-xs uppercase tracking-widest">End of list</p>
                      </div>
                    </div>
                  )}
                </div>
                
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
