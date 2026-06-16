"use client";

import { useState } from "react";
import { PlusCircle, MoreVertical, FileVideo, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSection, createLesson } from "@/lib/actions/curriculum";
import { VideoUploader } from "@/components/course/video-uploader";

type Lesson = {
  id: string;
  title: string;
  videoStatus: string;
};

type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export function CurriculumBuilder({ courseId, initialSections }: { courseId: string, initialSections: Section[] }) {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [uploadingTo, setUploadingTo] = useState<string | null>(null);

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    await createSection(courseId, newSectionTitle);
    setNewSectionTitle("");
    setIsAddingSection(false);
  };

  const handleAddLesson = async (sectionId: string) => {
    if (!newLessonTitle.trim()) return;
    await createLesson(sectionId, newLessonTitle);
    setNewLessonTitle("");
    setAddingLessonTo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Course Curriculum</h2>
        <Button onClick={() => setIsAddingSection(true)} size="sm" className="gap-1">
          <PlusCircle className="w-4 h-4" />
          Add Section
        </Button>
      </div>

      {isAddingSection && (
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-2">
          <Input 
            placeholder="e.g. Introduction to the Course" 
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="bg-transparent"
            autoFocus
          />
          <Button onClick={handleAddSection}>Save</Button>
          <Button variant="ghost" onClick={() => setIsAddingSection(false)}>Cancel</Button>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {initialSections.length === 0 && !isAddingSection ? (
          <div className="p-12 text-center text-muted-foreground">
            <p className="text-lg font-medium text-foreground mb-1">Your curriculum is empty</p>
            <p className="text-sm">Start building your course by adding your first section.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {initialSections.map((section) => (
              <div key={section.id} className="p-0">
                <div className="p-4 bg-muted/20 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {section.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8"
                      onClick={() => setAddingLessonTo(section.id)}
                    >
                      <PlusCircle className="w-4 h-4 mr-1" /> Add Lesson
                    </Button>
                  </div>
                </div>

                <div className="p-2 space-y-2">
                  {section.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex flex-col border border-border/50 rounded-lg p-3 bg-background">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileVideo className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">{lesson.title}</span>
                          
                          {/* Status Badge */}
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm ${
                            lesson.videoStatus === 'READY' ? 'bg-green-500/10 text-green-500' :
                            lesson.videoStatus === 'PROCESSING' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {lesson.videoStatus}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {lesson.videoStatus === 'PENDING' && (
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-7 text-xs"
                              onClick={() => setUploadingTo(uploadingTo === lesson.id ? null : lesson.id)}
                            >
                              <Video className="w-3 h-3 mr-1" />
                              {uploadingTo === lesson.id ? 'Cancel' : 'Upload Video'}
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Video Uploader Dropzone */}
                      {uploadingTo === lesson.id && lesson.videoStatus === 'PENDING' && (
                        <div className="mt-4 border-t border-border pt-4">
                          <VideoUploader 
                            lessonId={lesson.id} 
                            onUploadSuccess={() => {
                              setUploadingTo(null);
                              // In a real app, you might trigger a revalidation or polling here
                              window.location.reload(); 
                            }} 
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {addingLessonTo === section.id && (
                    <div className="flex items-center gap-2 border border-border/50 rounded-lg p-2 bg-muted/10">
                      <Input 
                        placeholder="e.g. Welcome & Setup" 
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        className="bg-background h-8 text-sm"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleAddLesson(section.id)}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setAddingLessonTo(null);
                        setNewLessonTitle("");
                      }}>Cancel</Button>
                    </div>
                  )}

                  {section.lessons.length === 0 && addingLessonTo !== section.id && (
                    <div className="text-xs text-muted-foreground text-center py-4 italic">
                      No lessons in this section yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
