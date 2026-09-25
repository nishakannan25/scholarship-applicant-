import React from 'react';
import { useApplicationStore } from '../stores/useApplicationStore';
import { User, Mail, Phone, Building2, MapPin } from 'lucide-react';

export const PersonalDetailsTab: React.FC = () => {
  const { currentApplication, updatePersonal } = useApplicationStore();
  const personal = currentApplication?.personal;

  if (!personal) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-primary" /> Step 1: Personal Information
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pre-filled from your registration profile. Please review and update if necessary.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Full Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <User className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={personal.fullName}
              onChange={(e) => updatePersonal({ fullName: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Email Address <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="email"
              value={personal.email}
              onChange={(e) => updatePersonal({ email: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Phone className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={personal.phone}
              onChange={(e) => updatePersonal({ phone: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Institution / University */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            University / Institution <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Building2 className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={personal.institution}
              onChange={(e) => updatePersonal({ institution: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Location Fields */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">City</label>
          <div className="relative">
            <MapPin className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={personal.city}
              onChange={(e) => updatePersonal({ city: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">State / Province</label>
          <input
            type="text"
            value={personal.state}
            onChange={(e) => updatePersonal({ state: e.target.value })}
            onBlur={() => useApplicationStore.getState().triggerAutosave()}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};
