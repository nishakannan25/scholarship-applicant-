import React from 'react';
import { useApplicationStore } from '../stores/useApplicationStore';
import { GraduationCap, BookOpen, Award } from 'lucide-react';

export const AcademicDetailsTab: React.FC = () => {
  const { currentApplication, updateAcademic } = useApplicationStore();
  const academic = currentApplication?.academic;

  if (!academic) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" /> Step 2: Academic Details
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Role-specific academic fields. Irrelevant role options are automatically hidden.
        </p>
      </div>

      {/* SCHOOL ROLE FIELDS */}
      {academic.role === 'school' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">School Name</label>
            <input
              type="text"
              value={academic.schoolName || ''}
              onChange={(e) => updateAcademic({ schoolName: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="e.g. St. Jude High School"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Class / Grade</label>
            <input
              type="text"
              value={academic.className || ''}
              onChange={(e) => updateAcademic({ className: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="e.g. Grade 12"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Education Board</label>
            <input
              type="text"
              value={academic.boardName || ''}
              onChange={(e) => updateAcademic({ boardName: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="e.g. CBSE / State Board"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Marks / Percentage</label>
            <input
              type="text"
              value={academic.schoolMarks || ''}
              onChange={(e) => updateAcademic({ schoolMarks: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="e.g. 92.5%"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* COLLEGE ROLE FIELDS */}
      {academic.role === 'college' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">College / University Name</label>
            <div className="relative">
              <BookOpen className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                value={academic.collegeName || ''}
                onChange={(e) => updateAcademic({ collegeName: e.target.value })}
                onBlur={() => useApplicationStore.getState().triggerAutosave()}
                placeholder="e.g. Stanford University"
                className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Degree / Course</label>
            <input
              type="text"
              value={academic.degree || ''}
              onChange={(e) => updateAcademic({ degree: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="e.g. B.Tech Computer Science"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Department</label>
            <input
              type="text"
              value={academic.department || ''}
              onChange={(e) => updateAcademic({ department: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="e.g. School of Engineering"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">CGPA / Percentage</label>
            <div className="relative">
              <Award className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                value={academic.cgpa || ''}
                onChange={(e) => updateAcademic({ cgpa: e.target.value })}
                onBlur={() => useApplicationStore.getState().triggerAutosave()}
                placeholder="e.g. 3.85 / 4.0"
                className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* OTHER ROLE FIELDS */}
      {academic.role === 'other' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Qualification Title</label>
            <input
              type="text"
              value={academic.qualification || ''}
              onChange={(e) => updateAcademic({ qualification: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="e.g. Diploma / Certification"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Institution Name</label>
            <input
              type="text"
              value={academic.otherInstitution || ''}
              onChange={(e) => updateAcademic({ otherInstitution: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="e.g. Vocational Institute"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-foreground mb-1">Additional Details</label>
            <textarea
              rows={3}
              value={academic.additionalDetails || ''}
              onChange={(e) => updateAcademic({ additionalDetails: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="Provide any additional qualification background..."
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
};
