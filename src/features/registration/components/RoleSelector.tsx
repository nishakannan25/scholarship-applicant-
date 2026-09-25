import React from 'react';
import { School, GraduationCap, User } from 'lucide-react';
import { useUiStore } from '../../../stores/useUiStore';

export type ApplicantRole = 'school' | 'college' | 'other';

interface RoleSelectorProps {
  value: ApplicantRole | '';
  onChange: (role: ApplicantRole) => void;
  error?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange, error }) => {
  const { t } = useUiStore();

  const roles = [
    {
      id: 'school' as ApplicantRole,
      title: t.schoolStudentTitle,
      description: t.schoolStudentDesc,
      icon: School,
    },
    {
      id: 'college' as ApplicantRole,
      title: t.collegeStudentTitle,
      description: t.collegeStudentDesc,
      icon: GraduationCap,
    },
    {
      id: 'other' as ApplicantRole,
      title: t.otherRoleTitle,
      description: t.otherRoleDesc,
      icon: User,
    },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {t.selectRole} <span className="text-destructive">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = value === role.id;
          return (
            <div
              key={role.id}
              onClick={() => onChange(role.id)}
              className={`cursor-pointer p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                  : 'border-border bg-card hover:bg-accent/50 hover:border-muted-foreground/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <input
                  type="radio"
                  name="role"
                  value={role.id}
                  checked={isSelected}
                  onChange={() => onChange(role.id)}
                  className="h-4 w-4 text-primary focus:ring-primary border-input"
                />
              </div>

              <div>
                <h4 className="font-semibold text-sm text-foreground">{role.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{role.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="text-xs text-destructive mt-1.5 font-medium">{error}</p>}
    </div>
  );
};
