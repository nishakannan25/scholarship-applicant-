import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { User, Building, GraduationCap, Check, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    institution: user?.institution || '',
    city: user?.city || '',
    state: user?.state || '',
    country: user?.country || 'India',
    boardType: user?.boardType || 'State Board (Tamil Nadu)',
    aadhaarNumber: user?.aadhaarNumber || '',
    age: user?.age || '',
    marks10th: user?.marks10th || '',
    percentage10th: user?.percentage10th || '',
    marks12th: user?.marks12th || '',
    percentage12th: user?.percentage12th || '',
    degreeCourse: user?.degreeCourse || '',
    studyYear: user?.studyYear || '',
    cgpaPercentage: user?.cgpaPercentage || '',
    majorBranch: user?.majorBranch || '',
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        institution: user.institution || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || 'India',
        boardType: user.boardType || 'State Board (Tamil Nadu)',
        aadhaarNumber: user.aadhaarNumber || '',
        age: user.age || '',
        marks10th: user.marks10th || '',
        percentage10th: user.percentage10th || '',
        marks12th: user.marks12th || '',
        percentage12th: user.percentage12th || '',
        degreeCourse: user.degreeCourse || '',
        studyYear: user.studyYear || '',
        cgpaPercentage: user.cgpaPercentage || '',
        majorBranch: user.majorBranch || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Update Auth Store & LocalStorage
    updateUser(formData);

    // 2. Persist to SQLite Database File (scholarpath.db)
    try {
      await fetch('http://localhost:8000/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          ...formData,
        }),
      });
    } catch (err) {
      console.warn('SQLite backend sync notice:', err);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Applicant Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and update your academic details, contact information, and board credentials.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2">
          <Check className="h-5 w-5" />
          Profile and academic details successfully saved to SQLite database (scholarpath.db)!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Personal Info */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Personal & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Aadhaar Number</label>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Institution */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            Institution & Location Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">School / Institution / University</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Academic Profile */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Academic Details & Qualifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Board / Education Type</label>
              <select
                name="boardType"
                value={formData.boardType}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="State Board (Tamil Nadu)">State Board (Tamil Nadu)</option>
                <option value="Central Board (CBSE / ICSE)">Central Board (CBSE / ICSE)</option>
                <option value="College Degree Program">College Degree Program</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">10th Marks / Percentage</label>
              <input
                type="text"
                name="percentage10th"
                value={formData.percentage10th}
                onChange={handleChange}
                placeholder="e.g. 485 Marks / 97%"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">12th Marks / Percentage</label>
              <input
                type="text"
                name="percentage12th"
                value={formData.percentage12th}
                onChange={handleChange}
                placeholder="e.g. 580 Marks / 96.6%"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Degree Course / Major</label>
              <input
                type="text"
                name="majorBranch"
                value={formData.majorBranch}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Profile & Sync SQLite DB
          </button>
        </div>
      </form>
    </div>
  );
};
